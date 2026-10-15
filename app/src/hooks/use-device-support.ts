import { useSyncExternalStore } from 'react';

/**
 * Minimum playable viewport, orientation-agnostic: the long side must be ≥ 568 and the short side ≥ 320
 * (a small phone in landscape). Menus work at any size.
 */
export const MIN_GAME_VIEWPORT = { width: 568, height: 320 } as const;

/** Below this width a portrait viewport is asked to rotate to landscape. */
export const ROTATE_BELOW_WIDTH = 900;

export type UnsupportedReason = 'viewport' | 'webgl2';

/** `ok` — play; `rotate` — playable once rotated to landscape; `unsupported` — cannot play here. */
export type DeviceStatus = 'ok' | 'rotate' | 'unsupported';

export interface DeviceSupport {
  status: DeviceStatus;
  /** Gameplay can run here (possibly after rotating). False only for `unsupported`. */
  supported: boolean;
  /** Portrait on a small screen — show {@link RotateDeviceNotice}. */
  rotate: boolean;
  reasons: UnsupportedReason[];
  viewport: { width: number; height: number };
  webgl2: boolean;
  /** Primary pointer is coarse (phone / tablet) — show touch controls. */
  isTouch: boolean;
}

let webgl2Cache: boolean | null = null;

/** Detect WebGL2 once (creating contexts is expensive and limited). */
export function hasWebGL2(): boolean {
  if (webgl2Cache !== null) return webgl2Cache;
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2');
    webgl2Cache = !!gl;
    gl?.getExtension('WEBGL_lose_context')?.loseContext();
  } catch {
    webgl2Cache = false;
  }
  return webgl2Cache;
}

/** True when the primary pointer is coarse (touch screens). */
export function isTouchDevice(): boolean {
  try {
    return window.matchMedia('(pointer: coarse)').matches;
  } catch {
    return false;
  }
}

/** Pure evaluation — exported for tests. */
export function evaluateDeviceSupport(width: number, height: number, webgl2: boolean, isTouch: boolean): DeviceSupport {
  const reasons: UnsupportedReason[] = [];
  const long = Math.max(width, height);
  const short = Math.min(width, height);
  if (long < MIN_GAME_VIEWPORT.width || short < MIN_GAME_VIEWPORT.height) reasons.push('viewport');
  if (!webgl2) reasons.push('webgl2');
  const rotate = reasons.length === 0 && width < ROTATE_BELOW_WIDTH && height > width;
  const status: DeviceStatus = reasons.length ? 'unsupported' : rotate ? 'rotate' : 'ok';
  return { status, supported: status !== 'unsupported', rotate, reasons, viewport: { width, height }, webgl2, isTouch };
}

let snapshot: DeviceSupport | null = null;
let snapshotKey = '';

function getSnapshot(): DeviceSupport {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const touch = isTouchDevice();
  const key = `${w}x${h}:${touch}`;
  if (!snapshot || key !== snapshotKey) {
    snapshotKey = key;
    snapshot = evaluateDeviceSupport(w, h, hasWebGL2(), touch);
  }
  return snapshot;
}

const serverSnapshot: DeviceSupport = evaluateDeviceSupport(1920, 1080, true, false);

function subscribe(cb: () => void) {
  window.addEventListener('resize', cb);
  window.addEventListener('orientationchange', cb);
  const mq = window.matchMedia?.('(pointer: coarse)');
  mq?.addEventListener?.('change', cb);
  return () => {
    window.removeEventListener('resize', cb);
    window.removeEventListener('orientationchange', cb);
    mq?.removeEventListener?.('change', cb);
  };
}

/**
 * Live device capability check for the game route. Touch devices and tablets are supported;
 * only a missing WebGL2 or a viewport below 568×320 blocks play. Portrait on small screens
 * yields `status: 'rotate'`. Re-evaluates on resize / orientation change.
 */
export function useDeviceSupport(): DeviceSupport {
  return useSyncExternalStore(subscribe, getSnapshot, () => serverSnapshot);
}
