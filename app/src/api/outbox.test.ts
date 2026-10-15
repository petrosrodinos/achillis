import { describe, expect, it, vi } from 'vitest';
import { createOutbox, isQueued, OUTBOX_STORAGE_KEY, type OutboxEvent, type OutboxStorage } from './outbox';
import { ApiError } from './errors';
import type { MissionCompleteResponse, MissionResult } from './types';

class MemoryStorage implements OutboxStorage {
  map = new Map<string, string>();
  getItem(k: string) {
    return this.map.get(k) ?? null;
  }
  setItem(k: string, v: string) {
    this.map.set(k, v);
  }
  removeItem(k: string) {
    this.map.delete(k);
  }
}

const result = (runToken: string): MissionResult => ({
  runToken,
  outcome: 'victory',
  durationMs: 120000,
  kills: { infantry: 4 },
  bossesDefeated: 0,
  damageTaken: 20,
  perfectBlocks: 1,
  dodges: 3,
  noHitRounds: 0,
  healthRemainingPct: 0.8,
  livesRemaining: 3,
  difficulty: 'knight',
});

const response = (score: number) => ({ accepted: true, score }) as unknown as MissionCompleteResponse;
const offline = () => ApiError.network(new TypeError('Failed to fetch'));

class FakeTarget {
  listeners = new Map<string, () => void>();
  addEventListener(type: string, fn: () => void) {
    this.listeners.set(type, fn);
  }
  removeEventListener(type: string) {
    this.listeners.delete(type);
  }
}

describe('outbox', () => {
  it('returns the server response when online', async () => {
    const storage = new MemoryStorage();
    const ob = createOutbox({ storage, submit: async () => response(500) });
    const out = await ob.submit(result('t1'));
    expect(isQueued(out)).toBe(false);
    expect(storage.getItem(OUTBOX_STORAGE_KEY)).toBeNull();
  });

  it('persists to storage on network failure and returns { queued: true }', async () => {
    const storage = new MemoryStorage();
    const events: OutboxEvent[] = [];
    const ob = createOutbox({ storage, submit: async () => Promise.reject(offline()) });
    ob.subscribe((e) => events.push(e));
    const out = await ob.submit(result('t1'));
    expect(out).toEqual({ queued: true });
    const stored = JSON.parse(storage.getItem(OUTBOX_STORAGE_KEY)!);
    expect(stored.version).toBe(1);
    expect(stored.entries).toHaveLength(1);
    expect(stored.entries[0].result.runToken).toBe('t1');
    expect(events.map((e) => e.type)).toEqual(['queued']);
  });

  it('queues on 5xx but rethrows permanent errors (422)', async () => {
    const storage = new MemoryStorage();
    const ob5 = createOutbox({ storage, submit: async () => Promise.reject(new ApiError(503, ['down'])) });
    expect(await ob5.submit(result('a'))).toEqual({ queued: true });
    const ob4 = createOutbox({ storage: new MemoryStorage(), submit: async () => Promise.reject(new ApiError(422, ['implausible'])) });
    await expect(ob4.submit(result('b'))).rejects.toMatchObject({ status: 422 });
  });

  it('does not queue the same run twice', async () => {
    const storage = new MemoryStorage();
    const ob = createOutbox({ storage, submit: async () => Promise.reject(offline()) });
    await ob.submit(result('same'));
    await ob.submit(result('same'));
    expect(ob.pending()).toHaveLength(1);
  });

  it('survives a reload: a new instance flushes what the previous one stored', async () => {
    const storage = new MemoryStorage();
    await createOutbox({ storage, submit: async () => Promise.reject(offline()) }).submit(result('t1'));
    const submit = vi.fn(async () => response(900));
    const ob2 = createOutbox({ storage, submit });
    const flushed: number[] = [];
    ob2.subscribe((e) => e.type === 'flushed' && flushed.push(e.response.score));
    expect(await ob2.flush()).toBe(0);
    expect(submit).toHaveBeenCalledTimes(1);
    expect(flushed).toEqual([900]);
    expect(storage.getItem(OUTBOX_STORAGE_KEY)).toBeNull();
  });

  it('stops flushing while still offline and keeps entries in order', async () => {
    const storage = new MemoryStorage();
    let online = false;
    const seen: string[] = [];
    const ob = createOutbox({
      storage,
      submit: async (r) => {
        seen.push(r.runToken);
        if (!online) throw offline();
        return response(1);
      },
    });
    await ob.submit(result('a'));
    await ob.submit(result('b'));
    seen.length = 0;
    expect(await ob.flush()).toBe(2);
    expect(seen).toEqual(['a']); // stopped at the first failure
    expect(ob.pending()[0].attempts).toBe(2);
    online = true;
    seen.length = 0;
    expect(await ob.flush()).toBe(0);
    expect(seen).toEqual(['a', 'b']);
  });

  it('drops entries the server permanently rejects and keeps them on 401', async () => {
    const storage = new MemoryStorage();
    let mode: 'offline' | '401' | '422' = 'offline';
    const events: string[] = [];
    const ob = createOutbox({
      storage,
      submit: async () => {
        if (mode === 'offline') throw offline();
        throw new ApiError(mode === '401' ? 401 : 422, ['x']);
      },
    });
    ob.subscribe((e) => events.push(e.type));
    await ob.submit(result('a'));
    mode = '401';
    expect(await ob.flush()).toBe(1);
    mode = '422';
    expect(await ob.flush()).toBe(0);
    expect(events).toEqual(['queued', 'dropped']);
  });

  it('retries when the browser comes back online', async () => {
    const storage = new MemoryStorage();
    let online = false;
    const submit = vi.fn(async () => {
      if (!online) throw offline();
      return response(7);
    });
    const ob = createOutbox({ storage, submit });
    await ob.submit(result('x'));
    const target = new FakeTarget();
    const stop = ob.start(target);
    await ob.flush(); // initial flush on start (still offline)
    expect(ob.pending()).toHaveLength(1);
    online = true;
    target.listeners.get('online')!();
    await ob.flush();
    expect(ob.pending()).toHaveLength(0);
    stop();
    expect(target.listeners.size).toBe(0);
  });

  it('ignores unreadable or wrong-version storage', () => {
    const storage = new MemoryStorage();
    storage.setItem(OUTBOX_STORAGE_KEY, '{not json');
    expect(createOutbox({ storage, submit: async () => response(1) }).pending()).toEqual([]);
    storage.setItem(OUTBOX_STORAGE_KEY, JSON.stringify({ version: 99, entries: [{ id: 'x' }] }));
    expect(createOutbox({ storage, submit: async () => response(1) }).pending()).toEqual([]);
  });

  it('expires entries older than 14 days', async () => {
    const storage = new MemoryStorage();
    let now = 1_000_000;
    const ob = createOutbox({ storage, submit: async () => Promise.reject(offline()), now: () => now });
    await ob.submit(result('old'));
    now += 15 * 24 * 3600 * 1000;
    expect(ob.pending()).toEqual([]);
  });
});
