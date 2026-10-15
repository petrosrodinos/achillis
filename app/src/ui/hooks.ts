import { useEffect, useState } from 'react';
import { useSettingsStore } from '@/core/settings/settings-store';
import { playUiSound } from '@/core/audio/audio-manager';

/** True when motion should be minimised (in-game setting, which itself defaults to the OS preference). */
export function useReducedMotion(): boolean {
  return useSettingsStore((s) => s.settings.reducedMotion);
}

export type UiSoundName = Parameters<typeof playUiSound>[0];

/** Fire-and-forget UI sound that never throws (audio may be unavailable). */
export function uiSound(name: UiSoundName): void {
  try {
    playUiSound(name);
  } catch {
    // audio unavailable — UI must keep working silently
  }
}

/**
 * Returns `true` once the image at `src` has loaded successfully, `false` if it failed,
 * `null` while pending. Used so missing art never shows a broken-image icon.
 */
export function useImageStatus(src: string | undefined | null): boolean | null {
  const [state, setState] = useState<{ src: string | null | undefined; ok: boolean | null }>({ src, ok: null });
  useEffect(() => {
    if (!src) return;
    let alive = true;
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => alive && setState({ src, ok: true });
    img.onerror = () => alive && setState({ src, ok: false });
    img.src = src;
    return () => {
      alive = false;
    };
  }, [src]);
  if (!src) return false;
  return state.src === src ? state.ok : null;
}
