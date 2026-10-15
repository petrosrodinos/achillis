import type { LeaderboardQuery } from './types';

/** Central TanStack Query keys. */
export const queryKeys = {
  me: ['me'] as const,
  progress: ['progress'] as const,
  leaderboard: (q: LeaderboardQuery) => ['leaderboard', q] as const,
  leaderboardAll: ['leaderboard'] as const,
};
