import { create } from 'zustand';
import type { MeResponse } from '@/api/types';
import { api } from '@/api/client';
import { isApiError } from '@/api/errors';
import { meApi } from '@/features/me/services/me.services';
import { useSettingsStore } from '@/core/settings/settings-store';
import { clearLocalSave } from '@/core/save/local-save';

export type SessionStatus = 'loading' | 'authenticated' | 'anonymous';

interface SessionState {
  status: SessionStatus;
  me: MeResponse | null;
  /** True when the last GET /me failed for a non-auth reason (offline / server down). */
  offline: boolean;
  /** Why the last session ended — a voluntary logout returns to the title, not the login page. */
  endReason: 'logout' | 'expired' | null;
  /** GET /me once on start; resolves when the status is known. */
  bootstrap: () => Promise<void>;
  /** Set the signed-in user (after login/register/GET me). Hydrates settings from the server copy. */
  setMe: (me: MeResponse) => void;
  /** Patch the cached user (e.g. profile after a mission). */
  patchMe: (patch: Partial<MeResponse>) => void;
  /** Local sign-out (after POST /auth/logout, a password reset, or a failed refresh). */
  clear: (reason?: 'logout' | 'expired') => void;
}

let bootstrapPromise: Promise<void> | null = null;

/** Session store: who is signed in. Server cookies are the source of truth; this mirrors GET /me. */
export const useSessionStore = create<SessionState>((set, get) => ({
  status: 'loading',
  me: null,
  offline: false,
  endReason: null,
  bootstrap: () => {
    if (!bootstrapPromise) {
      bootstrapPromise = meApi
        .get()
        .then((me) => get().setMe(me))
        .catch((e) => {
          // Not signed in (or refresh failed) → anonymous. Network errors also land here so the
          // title screen stays usable; `offline` lets the UI explain why.
          set({ status: 'anonymous', me: null, offline: !(isApiError(e) && e.status === 401) });
        })
        .finally(() => {
          bootstrapPromise = null;
        });
    }
    return bootstrapPromise;
  },
  setMe: (me) => {
    useSettingsStore.getState().hydrate(me.settings);
    set({ status: 'authenticated', me, offline: false, endReason: null });
  },
  patchMe: (patch) => {
    const me = get().me;
    if (me) set({ me: { ...me, ...patch } });
  },
  clear: (reason = 'logout') => {
    clearLocalSave();
    set({ status: 'anonymous', me: null, endReason: reason });
  },
}));

// A failed refresh anywhere in the app means the session is over.
api.setAuthFailureHandler(() => {
  if (useSessionStore.getState().status !== 'anonymous') useSessionStore.getState().clear('expired');
});

/** Non-React accessor. */
export const getSession = () => useSessionStore.getState();
