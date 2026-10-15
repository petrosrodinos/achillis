import type { GameSettings } from '@/api/types';
import { useSettingsStore } from '@/core/settings/settings-store';
import { meApi } from '@/features/me/services/me.services';
import { useSessionStore } from '@/stores/session-store';

/** Fields of `current` that differ from the server copy. */
export function diffSettings(current: GameSettings, server: GameSettings | undefined): Partial<GameSettings> {
  const patch: Record<string, unknown> = {};
  for (const key of Object.keys(current) as (keyof GameSettings)[]) {
    if (!server || JSON.stringify(current[key]) !== JSON.stringify(server[key])) patch[key] = current[key];
  }
  return patch as Partial<GameSettings>;
}

/**
 * Keeps the server copy of settings in sync: whenever local settings change while signed in,
 * the fields that differ from `me.settings` are PATCHed to /me/settings after a short debounce
 * (so hydration from the server is never echoed back). Also mirrors `reducedMotion` onto
 * `<html data-reduced-motion>`. Works from menus and the in-game pause overlay alike.
 * Call once at startup; returns a disposer.
 */
export function startSettingsSync(debounceMs = 700): () => void {
  let timer: ReturnType<typeof setTimeout> | undefined;

  const applyMotion = (s: GameSettings) => {
    document.documentElement.dataset.reducedMotion = String(s.reducedMotion);
  };
  applyMotion(useSettingsStore.getState().settings);

  const flush = () => {
    timer = undefined;
    const session = useSessionStore.getState();
    if (session.status !== 'authenticated' || !session.me) return;
    const patch = diffSettings(useSettingsStore.getState().settings, session.me.settings);
    if (Object.keys(patch).length === 0) return;
    meApi
      .updateSettings(patch)
      .then((saved) => {
        const me = useSessionStore.getState().me;
        if (me) useSessionStore.getState().patchMe({ settings: { ...me.settings, ...patch, ...(saved ?? {}) } });
      })
      .catch(() => {
        // Settings persist locally; the next change retries the full diff.
      });
  };

  const schedule = () => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(flush, debounceMs);
  };

  const unsub = useSettingsStore.subscribe((state, prev) => {
    if (state.settings === prev.settings) return;
    applyMotion(state.settings);
    schedule();
  });

  const onHide = () => {
    if (timer && document.visibilityState === 'hidden') {
      clearTimeout(timer);
      flush();
    }
  };
  document.addEventListener('visibilitychange', onHide);

  return () => {
    unsub();
    if (timer) clearTimeout(timer);
    document.removeEventListener('visibilitychange', onHide);
  };
}
