import { api } from '@/api/client';
import type { MissionCompleteResponse, MissionResult, MissionStartResponse, ProgressResponse } from '@/api/types';
import type { MissionId } from '@/content/ids';

/**
 * `/progress` endpoints (contracts §2.3).
 * For submitting results from the game prefer `submitMissionResult` (api/outbox.ts), which queues offline.
 */
export const progressApi = {
  get: () => api.get<ProgressResponse>('/progress'),
  /** Auto-saves server-side (currentMissionId, in_progress) and returns a signed run token. */
  missionStart: (missionId: MissionId) => api.post<MissionStartResponse>('/progress/mission-start', { missionId }),
  /** Raw submit (no offline queue). */
  missionComplete: (result: MissionResult) => api.post<MissionCompleteResponse>('/progress/mission-complete', result),
};
