import { attackPhase } from '@/core/sim/fighter';
import type { Fighter } from '@/core/sim/types';
import { loadoutFor, type Loadout } from '@/content/loadouts';
import type { BakedModel } from '@/render/models/model-library';

export interface Pose {
  clip: string;
  time: number;
  loop: boolean;
}

/** Stand-in clips used when a model does not (yet) ship a dedicated clip for a move. */
export const CLIP_FALLBACK: Record<string, string> = {
  JumpAttack: 'AttackLight',
  Plunge: 'AttackHeavy',
  ShieldBash: 'Throw',
  Lunge: 'AttackLight',
  ComboFinisher: 'AttackHeavy',
};

export function resolveClip(model: BakedModel, clip: string): string {
  if (model.clips[clip]) return clip;
  const fb = CLIP_FALLBACK[clip];
  return fb && model.clips[fb] ? fb : clip;
}

const OPEN_HELMS =new Set(['Hood', 'Turban', 'WizardHat', 'WitchHat', 'Viking', 'Nasal', 'Spiked']);

/** Map a fighter's simulation state to a clip + time. Attack clips are scrubbed by phase so hits line up. */
export function humanoidPose(f: Fighter, now: number): Pose {
  const offset = (f.id * 0.37) % 1;
  const mounted = f.mounted === 'horse';
  const flying = f.mounted === 'hippogryph';
  const ph = attackPhase(f);
  const attackClip = (name: string): Pose => ({ clip: name, time: ph ? ph.clipT : 1, loop: false });
  const frac = (dur: number) => (f.actionDur > 0 ? Math.min(1, f.actionT / f.actionDur) : 0) * dur;

  if (f.action === 'dead') return { clip: 'Death', time: f.deathT, loop: false };
  if (f.action === 'victory') return { clip: mounted || flying ? 'MountedIdle' : 'Victory', time: now, loop: true };

  if (mounted || flying) {
    switch (f.action) {
      case 'light':
      case 'cast':
      case 'shoot':
      case 'throw':
        return attackClip('MountedAttackLight');
      case 'heavy':
      case 'boss':
        return attackClip('MountedAttackHeavy');
      case 'block':
        return { clip: 'MountedBlock', time: now, loop: true };
      case 'hit':
      case 'stagger':
      case 'stunned':
        return { clip: 'MountedHit', time: frac(0.4), loop: false };
      default:
        if (flying) return { clip: 'FlyRide', time: now + offset, loop: true };
        return Math.abs(f.vx) > 0.6 ? { clip: 'MountedRide', time: now + offset, loop: true } : { clip: 'MountedIdle', time: now + offset, loop: true };
    }
  }

  switch (f.action) {
    case 'jumpAttack':
      return attackClip('JumpAttack');
    case 'plunge':
      return attackClip('Plunge');
    case 'bash':
      return attackClip('ShieldBash');
    case 'lunge':
      return attackClip('Lunge');
    case 'finisher':
      return attackClip('ComboFinisher');
    case 'light':
      return attackClip('AttackLight');
    case 'heavy':
    case 'boss':
      return attackClip('AttackHeavy');
    case 'cast':
      return attackClip('Cast');
    case 'shoot':
      return attackClip('Shoot');
    case 'throw':
      return attackClip('Throw');
    case 'dodge':
      return { clip: 'Dodge', time: frac(0.5), loop: false };
    case 'block':
      return f.blockAge < 0.15 ? { clip: 'BlockRaise', time: f.blockAge, loop: false } : { clip: 'BlockHold', time: now, loop: true };
    case 'hit':
      return { clip: 'Hit', time: frac(0.4), loop: false };
    case 'stagger':
      return { clip: 'Stagger', time: frac(0.8), loop: false };
    case 'stunned':
      return { clip: 'Stunned', time: now, loop: true };
    case 'rise':
      return { clip: 'Death', time: 1.2 * (1 - frac(1)), loop: false };
    case 'air':
      return f.vy > 0 ? { clip: 'Jump', time: Math.min(0.4, f.actionT), loop: false } : { clip: 'Fall', time: now, loop: true };
    case 'land':
      return { clip: 'Land', time: f.actionT, loop: false };
    case 'move': {
      const speed = Math.abs(f.vx);
      if (f.stats.flying) return { clip: 'Walk', time: now * 0.7 + offset, loop: true };
      // Advance gait by distance so feet don't skate.
      return speed > 3.2 ? { clip: 'Run', time: (f.x / 4.5) * f.facing, loop: true } : { clip: 'Walk', time: (f.x / 2.2) * f.facing, loop: true };
    }
    default:
      return { clip: 'Idle', time: now + offset * 2, loop: true };
  }
}

export function creaturePose(f: Fighter, now: number): Pose {
  const ph = attackPhase(f);
  const frac = (dur: number) => (f.actionDur > 0 ? Math.min(1, f.actionT / f.actionDur) : 0) * dur;
  const offset = (f.id * 0.37) % 1;
  const m = f.look.model;
  if (m === 'bird') return { clip: f.vy < -1.5 ? 'Dive' : 'Flap', time: now + offset, loop: true };
  if (m === 'haunted-tree') {
    if (f.action === 'dead') return { clip: 'Death', time: f.deathT, loop: false };
    if (f.action === 'rise') return { clip: 'Rise', time: frac(1), loop: false };
    if (ph) return { clip: 'Swipe', time: ph.clipT, loop: false };
    return { clip: 'Idle', time: now + offset, loop: true };
  }
  if (m === 'troll') return humanoidPose(f, now);
  // wolf / boar
  if (f.action === 'dead') return { clip: 'Death', time: f.deathT, loop: false };
  if (ph) return { clip: 'Attack', time: ph.clipT, loop: false };
  if (f.action === 'hit' || f.action === 'stagger') return { clip: 'Hit', time: frac(0.4), loop: false };
  if (f.action === 'move' || Math.abs(f.vx) > 0.5) return { clip: 'Run', time: now + offset, loop: true };
  return { clip: 'Idle', time: now + offset, loop: true };
}

export function mountPose(f: Fighter, now: number): Pose {
  const offset = (f.id * 0.37) % 1;
  if (f.mounted === 'hippogryph') {
    if (f.action === 'dead') return { clip: 'Hit', time: 0.4, loop: false };
    if (f.action === 'hit' || f.action === 'stagger') return { clip: 'Hit', time: Math.min(0.4, f.actionT), loop: false };
    if (f.grounded) return { clip: 'Idle', time: now, loop: true };
    return f.vy < -2 ? { clip: 'Glide', time: now + offset, loop: true } : { clip: 'Fly', time: now + offset, loop: true };
  }
  if (f.action === 'dead') return { clip: 'Death', time: f.deathT, loop: false };
  if (f.action === 'hit' || f.action === 'stagger') return { clip: 'Hit', time: Math.min(0.4, f.actionT), loop: false };
  const speed = Math.abs(f.vx);
  if (speed > 4) return { clip: 'Gallop', time: (f.x / 7) * f.facing, loop: true };
  if (speed > 0.4) return { clip: 'Walk', time: (f.x / 2.6) * f.facing, loop: true };
  return { clip: 'Idle', time: now + offset, loop: true };
}

/** Visibility mask of humanoid parts for a loadout + helmet state. Cached per key. */
const maskCache = new WeakMap<BakedModel, Map<string, Uint8Array>>();

export function humanoidMask(model: BakedModel, skin: string, helmet: boolean): Uint8Array {
  let byKey = maskCache.get(model);
  if (!byKey) {
    byKey = new Map();
    maskCache.set(model, byKey);
  }
  const key = `${skin}|${helmet}`;
  let mask = byKey.get(key);
  if (mask) return mask;
  const lo: Loadout = loadoutFor(skin);
  const helmOn = helmet && lo.helm !== null;
  mask = new Uint8Array(model.parts.length);
  // Multi-material parts export as e.g. Helm_Great_1; match the variant name or its numbered primitives.
  const is = (g: string, name: string) => g === name || (g.startsWith(name + '_') && /^\d+$/.test(g.slice(name.length + 1)));
  model.parts.forEach((p, i) => {
    const g = p.group;
    let show = false;
    if (g.startsWith('Base_')) show = true;
    else if (g.startsWith('Armor_')) show = lo.armor.some((a) => g.startsWith(`Armor_${a}_`));
    else if (g.startsWith('Helm_')) show = helmOn && is(g, `Helm_${lo.helm}`);
    else if (g.startsWith('Crest_')) show = helmOn && lo.crest !== null && is(g, `Crest_${lo.crest}`);
    else if (g.startsWith('Hair_')) {
      const kind = g.slice(5).replace(/_\d+$/, '') as 'Short' | 'Long' | 'Beard';
      const wanted = lo.hair.includes(kind) || (!helmOn && kind === 'Short' && lo.hair.length === 0 && lo.helm !== null);
      if (!helmOn) show = wanted || (kind === 'Short' && lo.helm !== null && !lo.hair.includes('Long'));
      else show = wanted && OPEN_HELMS.has(lo.helm!) && kind !== 'Short';
    } else if (g.startsWith('Back_')) show = lo.cape;
    else if (g.startsWith('Tabard_')) show = lo.tabard;
    else if (g.startsWith('Weapon_')) show = lo.weapon !== null && is(g, `Weapon_${lo.weapon}`);
    else if (g.startsWith('Shield_') || g.startsWith('Offhand_')) show = lo.offhand !== null && is(g, lo.offhand);
    else show = true;
    mask![i] = show ? 1 : 0;
  });
  byKey.set(key, mask);
  return mask;
}
