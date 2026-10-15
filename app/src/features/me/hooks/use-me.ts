import { useQuery } from '@tanstack/react-query';
import { meApi } from '../services/me.services';
import { queryKeys } from '@/api/query-keys';
import { useSessionStore } from '@/stores/session-store';

/** The signed-in user from the session (no request). */
export function useMe() {
  return useSessionStore((s) => s.me);
}

/**
 * Fresh GET /me (e.g. on the profile screen) that also updates the session copy.
 * Settings are not re-hydrated here to avoid clobbering unsaved local edits.
 */
export function useMeQuery() {
  const status = useSessionStore((s) => s.status);
  return useQuery({
    queryKey: queryKeys.me,
    enabled: status === 'authenticated',
    queryFn: async () => {
      const me = await meApi.get();
      const { patchMe } = useSessionStore.getState();
      patchMe({ profile: me.profile, emailVerified: me.emailVerified, unlockedCharacters: me.unlockedCharacters, username: me.username, email: me.email });
      return me;
    },
    staleTime: 30_000,
  });
}
