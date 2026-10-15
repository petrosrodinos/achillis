import { ApiError } from './errors';

/**
 * Fetch-based API client (contracts §1):
 * - `credentials: 'include'` (httpOnly cookies), JSON bodies, `X-Requested-With: XMLHttpRequest` on every call.
 * - On 401: one single-flight `POST /auth/refresh` shared by all concurrent callers, then the request is retried once.
 *   If refresh fails, the registered auth-failure handler runs (session → anonymous) and the 401 is thrown.
 * - Network errors (and 502/503/504) on idempotent requests are retried with exponential backoff + jitter.
 */

export type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
export type QueryValue = string | number | boolean | null | undefined;

export interface RequestOptions {
  method?: HttpMethod;
  body?: unknown;
  query?: Record<string, QueryValue>;
  /** Override idempotency (GET/PUT/DELETE are idempotent by default) — enables network retries. */
  idempotent?: boolean;
  /** Max network retries for idempotent calls (default from client config). */
  retries?: number;
  /** Attempt a token refresh on 401 (default true, except for auth endpoints). */
  refreshOn401?: boolean;
  signal?: AbortSignal;
}

export interface ApiClientConfig {
  baseUrl: string;
  fetch?: typeof fetch;
  /** Injected for tests. */
  sleep?: (ms: number) => Promise<void>;
  maxRetries?: number;
  baseDelayMs?: number;
}

/** Endpoints for which a 401 means "bad credentials/token", not "session expired". */
const NO_REFRESH_PATHS = ['/auth/login', '/auth/register', '/auth/refresh', '/auth/logout', '/auth/forgot-password', '/auth/reset-password', '/auth/verify-email'];

const RETRY_STATUSES = new Set([502, 503, 504]);

export interface ApiClient {
  request<T>(path: string, opts?: RequestOptions): Promise<T>;
  get<T>(path: string, query?: Record<string, QueryValue>, opts?: Omit<RequestOptions, 'method' | 'query'>): Promise<T>;
  post<T>(path: string, body?: unknown, opts?: Omit<RequestOptions, 'method' | 'body'>): Promise<T>;
  patch<T>(path: string, body?: unknown, opts?: Omit<RequestOptions, 'method' | 'body'>): Promise<T>;
  delete<T>(path: string, opts?: Omit<RequestOptions, 'method'>): Promise<T>;
  /** Single-flight refresh. Resolves true when the session was renewed. */
  refresh(): Promise<boolean>;
  /** Called once per failed refresh (e.g. to flip the session to anonymous). */
  setAuthFailureHandler(fn: (() => void) | null): void;
}

export function createApiClient(config: ApiClientConfig): ApiClient {
  const doFetch = config.fetch ?? ((...args: Parameters<typeof fetch>) => fetch(...args));
  const sleep = config.sleep ?? ((ms: number) => new Promise<void>((r) => setTimeout(r, ms)));
  const maxRetries = config.maxRetries ?? 3;
  const baseDelay = config.baseDelayMs ?? 400;
  const base = config.baseUrl.replace(/\/+$/, '');
  let refreshing: Promise<boolean> | null = null;
  let onAuthFailure: (() => void) | null = null;

  const buildUrl = (path: string, query?: Record<string, QueryValue>) => {
    let url = `${base}${path.startsWith('/') ? path : `/${path}`}`;
    if (query) {
      const qs = new URLSearchParams();
      for (const [k, v] of Object.entries(query)) if (v !== undefined && v !== null && v !== '') qs.set(k, String(v));
      const s = qs.toString();
      if (s) url += `?${s}`;
    }
    return url;
  };

  const parse = async (res: Response): Promise<unknown> => {
    if (res.status === 204) return undefined;
    const text = await res.text();
    if (!text) return undefined;
    const type = res.headers.get('content-type') ?? '';
    if (type.includes('json')) {
      try {
        return JSON.parse(text);
      } catch {
        return text;
      }
    }
    return text;
  };

  const send = async (method: HttpMethod, url: string, body: unknown, signal?: AbortSignal): Promise<Response> => {
    const headers: Record<string, string> = { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' };
    const init: RequestInit = { method, credentials: 'include', headers, signal };
    if (body !== undefined) {
      headers['Content-Type'] = 'application/json';
      init.body = JSON.stringify(body);
    }
    return doFetch(url, init);
  };

  /** Fetch with network retry/backoff for idempotent calls. */
  const sendWithRetry = async (method: HttpMethod, url: string, body: unknown, idempotent: boolean, retries: number, signal?: AbortSignal) => {
    for (let attempt = 0; ; attempt++) {
      let res: Response;
      try {
        res = await send(method, url, body, signal);
      } catch (err) {
        if ((err as { name?: string })?.name === 'AbortError') throw err;
        if (!idempotent || attempt >= retries) throw ApiError.network(err);
        await sleep(baseDelay * 2 ** attempt + Math.random() * 200);
        continue;
      }
      if (idempotent && RETRY_STATUSES.has(res.status) && attempt < retries) {
        await sleep(baseDelay * 2 ** attempt + Math.random() * 200);
        continue;
      }
      return res;
    }
  };

  const refresh = (): Promise<boolean> => {
    if (!refreshing) {
      refreshing = (async () => {
        try {
          const res = await sendWithRetry('POST', buildUrl('/auth/refresh'), undefined, true, 1);
          return res.ok;
        } catch {
          return false;
        }
      })().finally(() => {
        // Allow later refreshes once this one has settled; concurrent waiters already hold the promise.
        refreshing = null;
      });
    }
    return refreshing;
  };

  const request = async <T>(path: string, opts: RequestOptions = {}): Promise<T> => {
    const method = opts.method ?? 'GET';
    const idempotent = opts.idempotent ?? (method === 'GET' || method === 'PUT' || method === 'DELETE');
    const retries = opts.retries ?? maxRetries;
    const url = buildUrl(path, opts.query);
    const canRefresh = opts.refreshOn401 ?? !NO_REFRESH_PATHS.some((p) => path.startsWith(p));

    let res = await sendWithRetry(method, url, opts.body, idempotent, retries, opts.signal);
    if (res.status === 401 && canRefresh) {
      const renewed = await refresh();
      if (renewed) {
        res = await sendWithRetry(method, url, opts.body, idempotent, retries, opts.signal);
      }
      if (!renewed || res.status === 401) {
        const body = await parse(res).catch(() => undefined);
        onAuthFailure?.();
        throw ApiError.fromBody(401, body);
      }
    }
    const data = await parse(res);
    if (!res.ok) throw ApiError.fromBody(res.status, data);
    return data as T;
  };

  return {
    request,
    get: (path, query, opts) => request(path, { ...opts, method: 'GET', query }),
    post: (path, body, opts) => request(path, { ...opts, method: 'POST', body }),
    patch: (path, body, opts) => request(path, { ...opts, method: 'PATCH', body }),
    delete: (path, opts) => request(path, { ...opts, method: 'DELETE' }),
    refresh,
    setAuthFailureHandler: (fn) => {
      onAuthFailure = fn;
    },
  };
}

/** Base URL: `VITE_API_URL` when set, else `/api` (proxied by Vite in dev, rewritten by Vercel in prod). */
export const API_BASE_URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/+$/, '');

/** The app-wide client instance. */
export const api = createApiClient({ baseUrl: API_BASE_URL });
