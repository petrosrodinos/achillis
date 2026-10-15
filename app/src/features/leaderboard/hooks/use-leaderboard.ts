import { keepPreviousData, useQuery } from '@tanstack/react-query';
import type { LeaderboardQuery } from '@/api/types';
import { leaderboardApi } from '../services/leaderboard.services';
import { queryKeys } from '@/api/query-keys';

/** A page of the leaderboard; keeps the previous page visible while the next loads. */
export function useLeaderboard(q: LeaderboardQuery) {
  return useQuery({
    queryKey: queryKeys.leaderboard(q),
    queryFn: () => leaderboardApi.list(q),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
}
