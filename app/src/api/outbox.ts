import type { MissionCompleteResponse, MissionResult } from './types';
import { isApiError, isRetryableError } from './errors';
import { progressApi } from '@/features/progress/services/progress.services';

/**
 * Offline outbox for mission-complete submissions (spec §19 Reliability).
 *
 * `submit(result)` tries the API immediately. If it fails for a transient reason (offline, 5xx,
 * 408/429) the result is persisted to localStorage under a versioned key and `{ queued: true }`
 * is returned. Queued results are retried on `online` events, on app start (`start()`), and
 * whenever `flush()` is called. Permanent rejections (4xx such as 422 implausible / expired token)
 * are dropped; 401 keeps the entry for after the next login.
 */

export const OUTBOX_STORAGE_KEY = 'wk.outbox.v1';
const OUTBOX_VERSION = 1;
const MAX_AGE_MS = 14 * 24 * 60 * 60 * 1000;
const MAX_ENTRIES = 20;

export interface OutboxEntry {
  id: string;
  result: MissionResult;
  queuedAt: number;
  attempts: number;
}

interface StoredOutbox {
  version: number;
  entries: OutboxEntry[];
}

export type SubmitOutcome = MissionCompleteResponse | { queued: true };

export type OutboxEvent =
  | { type: 'queued'; entry: OutboxEntry }
  | { type: 'flushed'; entry: OutboxEntry; response: MissionCompleteResponse }
  | { type: 'dropped'; entry: OutboxEntry; error: unknown };

export interface OutboxStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

/** Minimal event target for `online` events (window in the app, a fake in tests). */
export interface OnlineEventTarget {
  addEventListener(type: 'online', fn: () => void): void;
  removeEventListener(type: 'online', fn: () => void): void;
}

export interface OutboxDeps {
  storage: OutboxStorage | null;
  submit: (result: MissionResult) => Promise<MissionCompleteResponse>;
  now?: () => number;
}

export interface Outbox {
  submit(result: MissionResult): Promise<SubmitOutcome>;
  /** Retry everything queued, oldest first. Single-flight. Resolves with the number still pending. */
  flush(): Promise<number>;
  pending(): OutboxEntry[];
  subscribe(fn: (e: OutboxEvent) => void): () => void;
  /** Flush now and on every `online` event. Returns a disposer. */
  start(target?: OnlineEventTarget): () => void;
}

export function isQueued(o: SubmitOutcome): o is { queued: true } {
  return (o as { queued?: boolean }).queued === true;
}

export function createOutbox({ storage, submit, now = Date.now }: OutboxDeps): Outbox {
  const listeners = new Set<(e: OutboxEvent) => void>();
  let memory: OutboxEntry[] = [];
  let flushing: Promise<number> | null = null;

  const emit = (e: OutboxEvent) => listeners.forEach((fn) => fn(e));

  const read = (): OutboxEntry[] => {
    if (!storage) return memory;
    try {
      const raw = storage.getItem(OUTBOX_STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw) as Partial<StoredOutbox>;
      if (parsed.version !== OUTBOX_VERSION || !Array.isArray(parsed.entries)) return [];
      return parsed.entries.filter((e) => e && typeof e.id === 'string' && e.result && now() - e.queuedAt < MAX_AGE_MS);
    } catch {
      return [];
    }
  };

  const write = (entries: OutboxEntry[]) => {
    memory = entries;
    if (!storage) return;
    try {
      if (entries.length === 0) storage.removeItem(OUTBOX_STORAGE_KEY);
      else storage.setItem(OUTBOX_STORAGE_KEY, JSON.stringify({ version: OUTBOX_VERSION, entries } satisfies StoredOutbox));
    } catch {
      // quota / private mode: keep in memory for this session
    }
  };

  const enqueue = (result: MissionResult): OutboxEntry => {
    const entry: OutboxEntry = {
      id: `${now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
      result,
      queuedAt: now(),
      attempts: 1,
    };
    // Never queue the same run twice.
    const entries = read().filter((e) => e.result.runToken !== result.runToken);
    write([...entries, entry].slice(-MAX_ENTRIES));
    emit({ type: 'queued', entry });
    return entry;
  };

  const remove = (id: string) => write(read().filter((e) => e.id !== id));

  const flushOnce = async (): Promise<number> => {
    for (const entry of read()) {
      try {
        const response = await submit(entry.result);
        remove(entry.id);
        emit({ type: 'flushed', entry, response });
      } catch (error) {
        if (isRetryableError(error) || (isApiError(error) && error.status === 401)) {
          write(read().map((e) => (e.id === entry.id ? { ...e, attempts: e.attempts + 1 } : e)));
          break; // still offline / logged out — try again later
        }
        remove(entry.id);
        emit({ type: 'dropped', entry, error });
      }
    }
    return read().length;
  };

  return {
    async submit(result) {
      try {
        return await submit(result);
      } catch (error) {
        if (isRetryableError(error)) {
          enqueue(result);
          return { queued: true };
        }
        throw error;
      }
    },
    flush() {
      if (!flushing) flushing = flushOnce().finally(() => (flushing = null));
      return flushing;
    },
    pending: () => read(),
    subscribe(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
    start(target: OnlineEventTarget = window) {
      const onOnline = () => void this.flush();
      target.addEventListener('online', onOnline);
      void this.flush();
      return () => target.removeEventListener('online', onOnline);
    },
  };
}

function safeLocalStorage(): OutboxStorage | null {
  try {
    if (typeof localStorage === 'undefined') return null;
    const probe = '__wk_probe__';
    localStorage.setItem(probe, '1');
    localStorage.removeItem(probe);
    return localStorage;
  } catch {
    return null;
  }
}

/** App-wide outbox instance. */
export const outbox = createOutbox({ storage: safeLocalStorage(), submit: (r) => progressApi.missionComplete(r) });

/**
 * Submit a mission result for the game page. Returns the server response, or `{ queued: true }`
 * when it was saved locally to retry later (offline / server unavailable). Throws on rejection (e.g. 422).
 */
export function submitMissionResult(result: MissionResult): Promise<SubmitOutcome> {
  return outbox.submit(result);
}
