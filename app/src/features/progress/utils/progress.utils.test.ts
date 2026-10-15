import { describe, expect, it } from 'vitest';
import type { MissionStatus, ProgressResponse } from '@/api/types';
import { MISSION_IDS, type MissionId } from '@/content/ids';
import { getContinueMissionId, missionStatus } from './progress.utils';

function progress(current: MissionId, highest: MissionId, statuses: Partial<Record<MissionId, MissionStatus>> = {}): ProgressResponse {
  const hi = MISSION_IDS.indexOf(highest);
  return {
    saveVersion: 1,
    currentMissionId: current,
    highestUnlockedMissionId: highest,
    trainingGroundsUnlocked: hi >= MISSION_IDS.indexOf('m07'),
    unlockedCharacters: ['white-knight'],
    missions: MISSION_IDS.map((id, i) => ({
      missionId: id,
      status: statuses[id] ?? (i < hi ? 'completed' : i === hi ? 'unlocked' : 'locked'),
      bestScore: 0,
      bestTimeMs: null,
      completions: i < hi ? 1 : 0,
      bestRank: null,
    })),
  };
}

describe('progress utils', () => {
  it('locks everything after the highest unlocked mission (strictly linear)', () => {
    const p = progress('m03', 'm03', { m05: 'unlocked' });
    expect(missionStatus(p, 'm02')).toBe('completed');
    expect(missionStatus(p, 'm03')).toBe('unlocked');
    expect(missionStatus(p, 'm04')).toBe('locked');
    expect(missionStatus(p, 'm05')).toBe('locked');
  });

  it('only m01 is available without progress', () => {
    expect(missionStatus(undefined, 'm01')).toBe('unlocked');
    expect(missionStatus(undefined, 'm02')).toBe('locked');
    expect(getContinueMissionId(undefined)).toBe('m01');
  });

  it('continues at the current mission when it is not finished', () => {
    expect(getContinueMissionId(progress('m04', 'm04', { m04: 'in_progress' }))).toBe('m04');
  });

  it('skips past completed and training missions', () => {
    expect(getContinueMissionId(progress('m02', 'm05'))).toBe('m05');
    expect(getContinueMissionId(progress('m07', 'm09'))).toBe('m09');
  });

  it('when training is the frontier, continue to the next story mission if open', () => {
    expect(getContinueMissionId(progress('m06', 'm07'))).toBe('m07');
  });
});
