import type { MissionProgressEntry, ProgressResponse, Rank } from '@/api/types';
import { MISSION_IDS, type CharacterId, type MissionId } from '@/content/ids';

/**
 * Versioned local cache of the last `ProgressResponse` (spec §19, P8-07 client side).
 * The server is authoritative; this cache only makes "Continue" and the campaign grid instant
 * while the network request is in flight, and keeps them usable offline.
 *
 * Stored shape: `{ version, userId, savedAt, data }`. Older versions are upgraded through
 * `SAVE_MIGRATIONS` step by step; anything unreadable is discarded.
 */

export const LOCAL_SAVE_KEY = 'wk.save';
export const CURRENT_SAVE_VERSION = 1;

export interface LocalSaveEnvelope<T = unknown> {
  version: number;
  userId?: string;
  savedAt?: number;
  data: T;
}

/**
 * v0 — the pre-release prototype cache: missions referenced by number, bests as a flat map.
 * Kept as the worked example for how a migration is written.
 */
export interface SaveV0 {
  currentMission: number;
  unlockedUpTo: number;
  bests?: Record<string, { score: number; timeMs?: number | null; rank?: Rank | null; clears?: number }>;
  characters?: CharacterId[];
}

type Migration = (data: unknown) => unknown;

const missionIdFromNumber = (n: number): MissionId => MISSION_IDS[Math.min(MISSION_IDS.length, Math.max(1, Math.floor(n))) - 1];

/** `from → from + 1` upgrade steps. */
export const SAVE_MIGRATIONS: Record<number, Migration> = {
  0: (raw) => {
    const v0 = raw as SaveV0;
    if (typeof v0?.currentMission !== 'number' || typeof v0?.unlockedUpTo !== 'number') throw new Error('invalid v0 save');
    const highest = missionIdFromNumber(v0.unlockedUpTo);
    const highestIdx = MISSION_IDS.indexOf(highest);
    const missions: MissionProgressEntry[] = MISSION_IDS.map((id, idx) => {
      const best = v0.bests?.[String(idx + 1)];
      const status: MissionProgressEntry['status'] = idx > highestIdx ? 'locked' : best ? 'completed' : 'unlocked';
      return {
        missionId: id,
        status,
        bestScore: best?.score ?? 0,
        bestTimeMs: best?.timeMs ?? null,
        completions: best ? (best.clears ?? 1) : 0,
        bestRank: best?.rank ?? null,
      };
    });
    const v1: ProgressResponse = {
      saveVersion: 1,
      currentMissionId: missionIdFromNumber(v0.currentMission),
      highestUnlockedMissionId: highest,
      trainingGroundsUnlocked: highestIdx >= MISSION_IDS.indexOf('m07'),
      missions,
      unlockedCharacters: v0.characters?.length ? v0.characters : ['white-knight'],
    };
    return v1;
  },
};

function isProgressV1(d: unknown): d is ProgressResponse {
  const p = d as ProgressResponse;
  return !!p && typeof p === 'object' && typeof p.currentMissionId === 'string' && Array.isArray(p.missions) && Array.isArray(p.unlockedCharacters);
}

/** Upgrade an envelope to the current version. Returns null if it cannot be read. */
export function migrateSave(envelope: unknown): LocalSaveEnvelope<ProgressResponse> | null {
  if (!envelope || typeof envelope !== 'object') return null;
  const env = envelope as Partial<LocalSaveEnvelope>;
  // Envelopes without a version are treated as v0.
  let version = typeof env.version === 'number' ? env.version : 0;
  let data: unknown = 'data' in env ? env.data : envelope;
  if (version > CURRENT_SAVE_VERSION) return null; // written by a newer client — ignore, server wins
  try {
    while (version < CURRENT_SAVE_VERSION) {
      const step = SAVE_MIGRATIONS[version];
      if (!step) return null;
      data = step(data);
      version++;
    }
  } catch {
    return null;
  }
  if (!isProgressV1(data)) return null;
  return { version, userId: env.userId, savedAt: env.savedAt, data };
}

function storage(): Storage | null {
  try {
    return typeof localStorage === 'undefined' ? null : localStorage;
  } catch {
    return null;
  }
}

/** Read the cached progress for `userId` (null if none, unreadable, or another user's). */
export function readLocalSave(userId: string | undefined, store: Pick<Storage, 'getItem' | 'setItem'> | null = storage()): ProgressResponse | null {
  if (!store || !userId) return null;
  try {
    const raw = store.getItem(LOCAL_SAVE_KEY);
    if (!raw) return null;
    const migrated = migrateSave(JSON.parse(raw));
    if (!migrated || (migrated.userId && migrated.userId !== userId)) return null;
    return migrated.data;
  } catch {
    return null;
  }
}

/** Cache the latest server progress. */
export function writeLocalSave(userId: string, data: ProgressResponse, store: Pick<Storage, 'setItem'> | null = storage()): void {
  if (!store) return;
  try {
    const env: LocalSaveEnvelope<ProgressResponse> = { version: CURRENT_SAVE_VERSION, userId, savedAt: Date.now(), data };
    store.setItem(LOCAL_SAVE_KEY, JSON.stringify(env));
  } catch {
    // ignore quota errors
  }
}

export function clearLocalSave(store: Pick<Storage, 'removeItem'> | null = storage()): void {
  try {
    store?.removeItem(LOCAL_SAVE_KEY);
  } catch {
    // ignore
  }
}
