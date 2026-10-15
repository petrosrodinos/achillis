import { create } from 'zustand';

/**
 * On-screen touch-control preferences. Device-specific, so stored locally only (not in
 * `GameSettings`, which the server validates strictly). Read by the in-game touch controls.
 */
export interface TouchSettings {
  /** Show on-screen controls during play (default on for touch devices). */
  enabled: boolean;
  /** Control opacity, 0.2..1. */
  opacity: number;
  /** Button scale. */
  size: 'small' | 'medium' | 'large';
  /** Mirror the layout: stick on the right, actions on the left. */
  leftHanded: boolean;
  /** Short vibration on hits / blocks where supported. */
  haptics: boolean;
}

export const DEFAULT_TOUCH_SETTINGS: TouchSettings = { enabled: true, opacity: 0.75, size: 'medium', leftHanded: false, haptics: true };

export const TOUCH_SETTINGS_KEY = 'wk.touch.v1';

function load(): TouchSettings {
  try {
    const raw = localStorage.getItem(TOUCH_SETTINGS_KEY);
    return raw ? { ...DEFAULT_TOUCH_SETTINGS, ...(JSON.parse(raw) as Partial<TouchSettings>) } : DEFAULT_TOUCH_SETTINGS;
  } catch {
    return DEFAULT_TOUCH_SETTINGS;
  }
}

interface TouchSettingsState {
  touch: TouchSettings;
  updateTouch: (patch: Partial<TouchSettings>) => void;
  resetTouch: () => void;
}

export const useTouchSettingsStore = create<TouchSettingsState>((set, get) => ({
  touch: typeof window === 'undefined' ? DEFAULT_TOUCH_SETTINGS : load(),
  updateTouch: (patch) => {
    const touch = { ...get().touch, ...patch };
    try {
      localStorage.setItem(TOUCH_SETTINGS_KEY, JSON.stringify(touch));
    } catch {
      // storage unavailable — keep in memory
    }
    set({ touch });
  },
  resetTouch: () => get().updateTouch(DEFAULT_TOUCH_SETTINGS),
}));

/** Non-React accessor for the game loop. */
export const getTouchSettings = () => useTouchSettingsStore.getState().touch;
