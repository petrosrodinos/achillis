import { useQuery } from '@tanstack/react-query';
import { progressApi } from '../services/progress.services';
import { queryKeys } from '@/api/query-keys';
import { readLocalSave, writeLocalSave } from '@/core/save/local-save';
import { useSessionStore } from '@/stores/session-store';

/**
 * Campaign progress. Seeds from the versioned local save so Continue / mission select render
 * instantly, then refreshes from the server (authoritative) and re-caches the result.
 */
export function useProgress() {
  const userId = useSessionStore((s) => s.me?.id);
  return useQuery({
    queryKey: [...queryKeys.progress, userId],
    enabled: !!userId,
    queryFn: async () => {
      const progress = await progressApi.get();
      if (userId) writeLocalSave(userId, progress);
      return progress;
    },
    placeholderData: () => readLocalSave(userId) ?? undefined,
    staleTime: 15_000,
  });
}
