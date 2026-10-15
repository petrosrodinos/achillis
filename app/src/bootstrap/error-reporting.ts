import { telemetryApi, type ClientErrorDto } from '@/features/telemetry/services/telemetry.services';

/**
 * Client error reporting (P8-06 client side): window.onerror, unhandledrejection and React
 * ErrorBoundary errors are POSTed to /api/telemetry/client-error. Throttled (max 5 per minute,
 * identical messages at most once per 30 s) and size-capped below the server's 16 KB limit.
 */

const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;
const DEDUPE_MS = 30_000;
const MAX_FIELD = 6_000;

const IGNORED = [/ResizeObserver loop/i, /^Script error\.?$/i, /extension:\/\//i, /AbortError/i];

export interface ReporterDeps {
  send: (dto: ClientErrorDto) => Promise<unknown>;
  now?: () => number;
}

export function createErrorReporter({ send, now = Date.now }: ReporterDeps) {
  let windowStart = 0;
  let count = 0;
  const recent = new Map<string, number>();
  let sending = false;

  return function report(error: unknown, context?: Record<string, unknown>): boolean {
    const err = error instanceof Error ? error : new Error(typeof error === 'string' ? error : safeStringify(error));
    const message = (err.message || 'Unknown error').slice(0, 1000);
    if (IGNORED.some((re) => re.test(message) || re.test(err.stack ?? ''))) return false;

    const t = now();
    if (t - windowStart > WINDOW_MS) {
      windowStart = t;
      count = 0;
    }
    if (count >= MAX_PER_WINDOW) return false;
    const last = recent.get(message);
    if (last !== undefined && t - last < DEDUPE_MS) return false;
    // Never report errors raised while reporting.
    if (sending) return false;

    count++;
    recent.set(message, t);
    if (recent.size > 50) recent.delete(recent.keys().next().value as string);

    const dto: ClientErrorDto = {
      message,
      stack: err.stack?.slice(0, MAX_FIELD),
      url: typeof location !== 'undefined' ? location.href.slice(0, 500) : '',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent.slice(0, 300) : '',
      context: context ? safeContext(context) : undefined,
    };
    sending = true;
    send(dto)
      .catch(() => undefined)
      .finally(() => {
        sending = false;
      });
    return true;
  };
}

function safeContext(ctx: Record<string, unknown>): Record<string, unknown> {
  try {
    return JSON.parse(safeStringify(ctx)) as Record<string, unknown>;
  } catch {
    return {};
  }
}

function safeStringify(v: unknown): string {
  try {
    const s = JSON.stringify(v);
    return s && s.length <= 2000 ? s : '{}';
  } catch {
    return String(v);
  }
}

/** App-wide reporter. Safe to call from anywhere (including the game loop's catch blocks). */
export const reportClientError = createErrorReporter({ send: (dto) => telemetryApi.clientError(dto) });

/** Install window.onerror / unhandledrejection handlers. Returns a disposer. */
export function installGlobalErrorHandlers(): () => void {
  const onError = (e: ErrorEvent) => {
    reportClientError(e.error ?? e.message, { source: 'window.onerror', file: e.filename, line: e.lineno, col: e.colno });
  };
  const onRejection = (e: PromiseRejectionEvent) => {
    reportClientError(e.reason, { source: 'unhandledrejection' });
  };
  window.addEventListener('error', onError);
  window.addEventListener('unhandledrejection', onRejection);
  return () => {
    window.removeEventListener('error', onError);
    window.removeEventListener('unhandledrejection', onRejection);
  };
}
