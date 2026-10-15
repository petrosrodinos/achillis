import { describe, expect, it } from 'vitest';
import { CURRENT_SAVE_VERSION, LOCAL_SAVE_KEY, migrateSave, readLocalSave, writeLocalSave, type SaveV0 } from './local-save';
import type { ProgressResponse } from '@/api/types';

class MemoryStorage {
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

const v1: ProgressResponse = {
  saveVersion: 1,
  currentMissionId: 'm03',
  highestUnlockedMissionId: 'm03',
  trainingGroundsUnlocked: false,
  missions: [],
  unlockedCharacters: ['white-knight'],
};

describe('local save', () => {
  it('migrates a v0 envelope to v1', () => {
    const v0: SaveV0 = {
      currentMission: 3,
      unlockedUpTo: 8,
      bests: { '1': { score: 4200, timeMs: 180000, rank: 'A' }, '2': { score: 900, clears: 3 } },
      characters: ['white-knight', 'black-knight'],
    };
    const out = migrateSave({ version: 0, userId: 'u1', data: v0 });
    expect(out?.version).toBe(CURRENT_SAVE_VERSION);
    const p = out!.data;
    expect(p.currentMissionId).toBe('m03');
    expect(p.highestUnlockedMissionId).toBe('m08');
    expect(p.trainingGroundsUnlocked).toBe(true);
    expect(p.missions).toHaveLength(15);
    expect(p.missions[0]).toMatchObject({ missionId: 'm01', status: 'completed', bestScore: 4200, bestTimeMs: 180000, bestRank: 'A', completions: 1 });
    expect(p.missions[1]).toMatchObject({ status: 'completed', completions: 3, bestTimeMs: null });
    expect(p.missions[2]).toMatchObject({ status: 'unlocked', completions: 0 });
    expect(p.missions[8]).toMatchObject({ missionId: 'm09', status: 'locked' });
    expect(p.unlockedCharacters).toEqual(['white-knight', 'black-knight']);
  });

  it('treats a bare unversioned object as v0', () => {
    const out = migrateSave({ currentMission: 1, unlockedUpTo: 1 });
    expect(out?.data.currentMissionId).toBe('m01');
    expect(out?.data.trainingGroundsUnlocked).toBe(false);
    expect(out?.data.unlockedCharacters).toEqual(['white-knight']);
  });

  it('passes current-version saves through unchanged', () => {
    expect(migrateSave({ version: 1, data: v1 })?.data).toEqual(v1);
  });

  it('rejects corrupt, future-version and invalid data', () => {
    expect(migrateSave(null)).toBeNull();
    expect(migrateSave({ version: 0, data: { nope: true } })).toBeNull();
    expect(migrateSave({ version: 99, data: v1 })).toBeNull();
    expect(migrateSave({ version: 1, data: { currentMissionId: 'm01' } })).toBeNull();
  });

  it('round-trips through storage and is scoped to the user', () => {
    const s = new MemoryStorage();
    writeLocalSave('u1', v1, s);
    expect(JSON.parse(s.getItem(LOCAL_SAVE_KEY)!).version).toBe(CURRENT_SAVE_VERSION);
    expect(readLocalSave('u1', s)).toEqual(v1);
    expect(readLocalSave('u2', s)).toBeNull();
    expect(readLocalSave(undefined, s)).toBeNull();
  });

  it('reads and upgrades an old v0 save from storage', () => {
    const s = new MemoryStorage();
    s.setItem(LOCAL_SAVE_KEY, JSON.stringify({ version: 0, userId: 'u1', data: { currentMission: 2, unlockedUpTo: 2 } }));
    expect(readLocalSave('u1', s)?.currentMissionId).toBe('m02');
  });

  it('survives garbage in storage', () => {
    const s = new MemoryStorage();
    s.setItem(LOCAL_SAVE_KEY, '{oops');
    expect(readLocalSave('u1', s)).toBeNull();
  });
});
