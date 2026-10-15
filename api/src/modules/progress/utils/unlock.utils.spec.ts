import { MISSION_IDS } from '@/shared/constants/game.constants';
import { MISSIONS_CATALOG } from '../config/missions.catalog';
import {
  betterRank,
  buildMissionList,
  highestUnlocked,
  isPlayable,
  MissionProgressRow,
  missionToUnlock,
  trainingGroundsUnlocked,
} from './unlock.utils';
import { pendingMigrations } from './save-migrations.utils';

const row = (
  mission_id: string,
  status: MissionProgressRow['status'],
  extra: Partial<MissionProgressRow> = {},
): MissionProgressRow => ({
  mission_id,
  status,
  best_score: 0,
  best_time_ms: null,
  best_rank: null,
  completions: 0,
  ...extra,
});

describe('linear unlocks', () => {
  it('completing mN unlocks mN+1 only', () => {
    expect(missionToUnlock('m01', [row('m01', 'completed')])).toBe('m02');
    expect(missionToUnlock('m06', [row('m06', 'completed')])).toBe('m07');
  });

  it('does not re-unlock an already playable mission and stops after m15', () => {
    expect(
      missionToUnlock('m01', [
        row('m01', 'completed'),
        row('m02', 'in_progress'),
      ]),
    ).toBeNull();
    expect(missionToUnlock('m15', [row('m15', 'completed')])).toBeNull();
  });

  it('re-unlocks a stored locked row', () => {
    expect(missionToUnlock('m02', [row('m03', 'locked')])).toBe('m03');
  });

  it('training grounds open once m07 is unlocked', () => {
    expect(trainingGroundsUnlocked([row('m01', 'unlocked')])).toBe(false);
    expect(trainingGroundsUnlocked([row('m07', 'unlocked')])).toBe(true);
    expect(trainingGroundsUnlocked([row('m07', 'locked')])).toBe(false);
  });

  it('computes the highest unlocked mission', () => {
    expect(highestUnlocked([])).toBe('m01');
    expect(
      highestUnlocked([
        row('m01', 'completed'),
        row('m02', 'completed'),
        row('m03', 'unlocked'),
      ]),
    ).toBe('m03');
  });

  it('builds a full 15-mission list with missing missions locked', () => {
    const list = buildMissionList([
      row('m01', 'completed', {
        best_score: 1200,
        completions: 2,
        best_rank: 'A',
        best_time_ms: 90_000,
      }),
    ]);
    expect(list).toHaveLength(15);
    expect(list[0]).toEqual({
      missionId: 'm01',
      status: 'completed',
      bestScore: 1200,
      bestTimeMs: 90_000,
      completions: 2,
      bestRank: 'A',
    });
    expect(list[1]).toEqual({
      missionId: 'm02',
      status: 'locked',
      bestScore: 0,
      bestTimeMs: null,
      completions: 0,
      bestRank: null,
    });
  });

  it('isPlayable / betterRank helpers', () => {
    expect(isPlayable(undefined)).toBe(false);
    expect(isPlayable(row('m01', 'locked'))).toBe(false);
    expect(isPlayable(row('m01', 'unlocked'))).toBe(true);
    expect(betterRank('B', 'S')).toBe('S');
    expect(betterRank('A', 'C')).toBe('A');
    expect(betterRank(null, 'D')).toBe('D');
  });
});

describe('missions catalog', () => {
  it('has an entry for every mission id', () => {
    expect(Object.keys(MISSIONS_CATALOG).sort()).toEqual([...MISSION_IDS]);
  });

  it('matches the character unlocks in contracts §3', () => {
    expect(MISSIONS_CATALOG.m03.unlocksCharacters).toEqual(['black-knight']);
    expect(MISSIONS_CATALOG.m04.unlocksCharacters).toEqual([
      'mysterious-knight',
      'bronze-knight',
    ]);
    expect(MISSIONS_CATALOG.m06.unlocksCharacters).toHaveLength(6);
    expect(MISSIONS_CATALOG.m11.unlocksCharacters).toEqual(['green-chestnut']);
    expect(MISSIONS_CATALOG.m12.unlocksCharacters).toEqual([
      'saracen-leader-1',
      'saracen-leader-2',
    ]);
  });

  it('uses the plausibility floors (duels 20 s, quests/open-field 60 s, m07 15 s)', () => {
    for (const mission of Object.values(MISSIONS_CATALOG)) {
      const expected =
        mission.id === 'm07'
          ? 15_000
          : mission.engine === 'duel'
            ? 20_000
            : 60_000;
      expect(mission.minDurationMs).toBe(expected);
      expect(mission.parTimeMs).toBeGreaterThan(mission.minDurationMs);
    }
  });
});

describe('save migrations', () => {
  it('needs no migration at the current version', () => {
    expect(pendingMigrations(1)).toEqual([]);
  });

  it('chains migrations up to the target version', () => {
    const step = jest.fn();
    expect(pendingMigrations(1, { 1: step, 2: step }, 3)).toHaveLength(2);
    expect(() => pendingMigrations(1, {}, 2)).toThrow('Missing save migration');
  });
});
