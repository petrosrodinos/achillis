import { create } from 'zustand';
import type { HudSnapshot } from '@/core/engine/engine-types';

interface HudState {
  hud: HudSnapshot | null;
  fps: number;
}

/**
 * Bridge between the simulation and React HUD. The game loop publishes a snapshot once per
 * rendered frame, but the store only updates (and React only re-renders) when a value changed.
 */
export const useHudStore = create<HudState>(() => ({ hud: null, fps: 0 }));

let lastKey = '';

export function publishHud(snapshot: HudSnapshot) {
  const key = JSON.stringify(snapshot);
  if (key === lastKey) return;
  lastKey = key;
  useHudStore.setState({ hud: snapshot });
}

export function resetHud() {
  lastKey = '';
  useHudStore.setState({ hud: null });
}

/** Short-lived move callouts ("Riposte!") shown near the centre of the screen. */
export const useCalloutStore = create<{ text: string | null; id: number }>(() => ({ text: null, id: 0 }));

let calloutTimer: ReturnType<typeof setTimeout> | null = null;
export function publishCallout(text: string) {
  useCalloutStore.setState((s) => ({ text, id: s.id + 1 }));
  if (calloutTimer) clearTimeout(calloutTimer);
  calloutTimer = setTimeout(() => useCalloutStore.setState({ text: null }), 900);
}

let fpsAcc = 0;
let fpsFrames = 0;
export function publishFps(dt: number) {
  fpsAcc += dt;
  fpsFrames++;
  if (fpsAcc >= 0.5) {
    useHudStore.setState({ fps: Math.round(fpsFrames / fpsAcc) });
    fpsAcc = 0;
    fpsFrames = 0;
  }
}
