import type { MissionProgressEntry, MissionStatus, ProgressResponse } from '@/api/types';
import { MISSION_IDS, type MissionId } from '@/content/ids';

const TRAINING_ID: MissionId = 'm07';

/**
 * Effective status of a mission. The campaign is strictly linear (spec §16.2): anything after
 * `highestUnlockedMissionId` is locked even if the server entry says otherwise.
 */
export function missionStatus(progress: ProgressResponse | null | undefined, id: MissionId): MissionStatus {
  if (!progress) return id === 'm01' ? 'unlocked' : 'locked';
  const idx = MISSION_IDS.indexOf(id);
  const highestIdx = MISSION_IDS.indexOf(progress.highestUnlockedMissionId);
  const entry = progress.missions.find((m) => m.missionId === id);
  if (idx > highestIdx) return 'locked';
  if (id === TRAINING_ID && !progress.trainingGroundsUnlocked) return 'locked';
  if (!entry || entry.status === 'locked') return 'unlocked';
  return entry.status;
}

export function missionEntry(progress: ProgressResponse | null | undefined, id: MissionId): MissionProgressEntry | undefined {
  return progress?.missions.find((m) => m.missionId === id);
}

export function isMissionPlayable(progress: ProgressResponse | null | undefined, id: MissionId): boolean {
  return missionStatus(progress, id) !== 'locked';
}

/**
 * Where "Continue" goes: the last mission reached. If that mission is Training Grounds or
 * already completed, continue at the furthest unlocked campaign mission instead.
 */
export function getContinueMissionId(progress: ProgressResponse | null | undefined): MissionId {
  if (!progress) return 'm01';
  const current = progress.currentMissionId;
  const currentStatus = missionStatus(progress, current);
  if (current !== TRAINING_ID && currentStatus !== 'completed' && currentStatus !== 'locked') return current;
  const highest = progress.highestUnlockedMissionId;
  if (highest === TRAINING_ID) {
    // m07 is optional — the next story mission becomes available after it is unlocked.
    const next = MISSION_IDS[MISSION_IDS.indexOf(TRAINING_ID) + 1];
    return missionStatus(progress, next) !== 'locked' ? next : TRAINING_ID;
  }
  return highest;
}

/** True once every story mission is completed. */
export function isCampaignComplete(progress: ProgressResponse | null | undefined): boolean {
  return !!progress && missionStatus(progress, 'm15') === 'completed';
}
