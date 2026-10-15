import type { ApiErrorBody } from './types';

/** Error thrown by the API client for any non-2xx response or network failure. */
export class ApiError extends Error {
  /** HTTP status; 0 for network failures (offline, DNS, CORS, aborted). */
  readonly status: number;
  /** Server messages (Nest validation returns an array). */
  readonly messages: string[];
  /** Nest's `error` field, e.g. "Bad Request". */
  readonly code?: string;
  readonly body?: unknown;

  constructor(status: number, messages: string[], opts: { code?: string; body?: unknown; cause?: unknown } = {}) {
    super(messages.join(' ') || (status === 0 ? 'Network error' : `Request failed (${status})`), { cause: opts.cause });
    this.name = 'ApiError';
    this.status = status;
    this.messages = messages;
    this.code = opts.code;
    this.body = opts.body;
  }

  get isNetworkError(): boolean {
    return this.status === 0;
  }

  get isUnauthorized(): boolean {
    return this.status === 401;
  }

  static fromBody(status: number, body: unknown): ApiError {
    const b = body as Partial<ApiErrorBody> | undefined;
    const raw = b && typeof b === 'object' ? b.message : typeof body === 'string' ? body : undefined;
    const messages = Array.isArray(raw) ? raw.map(String) : raw ? [String(raw)] : [];
    return new ApiError(status, messages, { code: b && typeof b === 'object' ? b.error : undefined, body });
  }

  static network(cause: unknown): ApiError {
    return new ApiError(0, ['Could not reach the server. Check your connection.'], { cause });
  }
}

export function isApiError(e: unknown): e is ApiError {
  return e instanceof ApiError;
}

/** Worth retrying later: offline / timeouts / rate limits / server errors. */
export function isRetryableError(e: unknown): boolean {
  if (!isApiError(e)) return e instanceof TypeError;
  return e.status === 0 || e.status === 408 || e.status === 429 || e.status >= 500;
}

/** A friendly single-line message for toasts. */
export function errorMessage(e: unknown, fallback = 'Something went wrong. Please try again.'): string {
  if (isApiError(e)) {
    if (e.status === 0) return 'Could not reach the server. Check your connection.';
    if (e.status === 429) return 'Too many attempts. Please wait a moment and try again.';
    if (e.status >= 500) return 'The server stumbled. Please try again shortly.';
    if (e.messages.length) return e.messages.join(' ');
  }
  return fallback;
}

/**
 * Map server validation messages onto form fields by looking for the field name at the start
 * of each message (Nest/class-validator style: "username must be…", "Email already in use").
 * Unmatched messages are returned under `_form`.
 */
export function fieldErrorsFrom<F extends string>(e: unknown, fields: readonly F[]): Partial<Record<F | '_form', string>> {
  const out: Partial<Record<F | '_form', string>> = {};
  if (!isApiError(e)) {
    out._form = errorMessage(e);
    return out;
  }
  if (e.status === 0 || e.status === 429 || e.status >= 500) {
    out._form = errorMessage(e);
    return out;
  }
  for (const msg of e.messages) {
    const lower = msg.toLowerCase();
    const field = fields.find((f) => lower.startsWith(f.toLowerCase()) || lower.includes(` ${f.toLowerCase()} `) || lower.includes(`${f.toLowerCase()} already`));
    const key = (field ?? '_form') as F | '_form';
    if (!out[key]) out[key] = msg.charAt(0).toUpperCase() + msg.slice(1);
  }
  if (Object.keys(out).length === 0) out._form = errorMessage(e);
  return out;
}
