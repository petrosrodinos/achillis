import { api } from '@/api/client';
import type { LeaderboardQuery, LeaderboardResponse } from '@/api/types';

const toParams = (q: LeaderboardQuery) => ({
  scope: q.scope,
  missionId: q.scope === 'mission' ? q.missionId : undefined,
  window: q.window,
  sort: q.scope === 'mission' ? q.sort : 'points',
  page: q.page,
  limit: q.limit,
});

/** `/leaderboard` endpoints (contracts §2.4). */
export const leaderboardApi = {
  list: (q: LeaderboardQuery) => api.get<LeaderboardResponse>('/leaderboard', toParams(q)),
  me: (q: LeaderboardQuery) => api.get<LeaderboardResponse['me']>('/leaderboard/me', toParams(q)),
};
