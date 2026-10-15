import { ATTACK_TIMING, BLOCK, MOVES, REACTION, type AttackTiming } from './combat-config';

export type MeleeKind = 'light' | 'heavy' | 'boss' | 'bash';
export type AttackPhase = 'anticipation' | 'swing' | 'impact' | 'recovery' | 'done';

/** Clip phase fractions shared with the Blender attack clips (docs/contracts.md §4.1). */
export const CLIP_PHASES = { anticipation: 0.35, swing: 0.5, impact: 0.6 } as const;

export function timingTotal(t: AttackTiming, speed = 1): number {
  return (t.anticipation + t.swing + t.impact + t.recovery) / speed;
}

/**
 * Phase of an attack at elapsed time `t` and the matching normalised clip time (0..1),
 * mapping each sim phase linearly onto its clip segment so animation stays in sync with hit frames.
 */
export function attackPhaseAt(timing: AttackTiming, t: number, speed = 1): { phase: AttackPhase; clipT: number; phaseT: number } {
  const a = timing.anticipation / speed;
  const s = timing.swing / speed;
  const i = timing.impact / speed;
  const r = timing.recovery / speed;
  if (t < a) return { phase: 'anticipation', clipT: (t / a) * CLIP_PHASES.anticipation, phaseT: t / a };
  if (t < a + s) {
    const k = (t - a) / s;
    return { phase: 'swing', clipT: CLIP_PHASES.anticipation + k * (CLIP_PHASES.swing - CLIP_PHASES.anticipation), phaseT: k };
  }
  if (t < a + s + i) {
    const k = (t - a - s) / i;
    return { phase: 'impact', clipT: CLIP_PHASES.swing + k * (CLIP_PHASES.impact - CLIP_PHASES.swing), phaseT: k };
  }
  if (t < a + s + i + r) {
    const k = (t - a - s - i) / r;
    return { phase: 'recovery', clipT: CLIP_PHASES.impact + k * (1 - CLIP_PHASES.impact), phaseT: k };
  }
  return { phase: 'done', clipT: 1, phaseT: 1 };
}

/** Hits are registered from the last part of the swing through the impact window. */
export function isHitActive(phase: AttackPhase, phaseT: number): boolean {
  return phase === 'impact' || (phase === 'swing' && phaseT > 0.5);
}

export interface DefenderState {
  blocking: boolean;
  /** Seconds since the shield was raised. */
  blockAge: number;
  /** True when the defender faces the attacker (blocks only work from the front). */
  facingAttacker: boolean;
  invulnerable: boolean;
  helmetless: boolean;
  /** 'full' = never flinches (bosses mid-heavy, troll), 'light' = ignores light hitstun. */
  poise: 'none' | 'light' | 'full';
  canBlock: boolean;
}

export type HitOutcome = 'ignored' | 'hit' | 'blocked' | 'blockBreak' | 'parried';

export interface HitResolution {
  outcome: HitOutcome;
  damage: number;
  /** Hitstun or stagger applied to the defender (seconds). */
  stun: number;
  stagger: boolean;
  knockback: number;
  hitPause: number;
  /** Stagger applied to the attacker (parry). */
  attackerStagger: number;
}

const NONE: HitResolution = { outcome: 'ignored', damage: 0, stun: 0, stagger: false, knockback: 0, hitPause: 0, attackerStagger: 0 };

/** Resolve a melee strike against a defender. `damage` is already scaled by difficulty/attacker. */
export function resolveMeleeHit(kind: MeleeKind, damage: number, d: DefenderState): HitResolution {
  if (d.invulnerable) return NONE;
  if (kind === 'bash') {
    // Shield bash: little damage, but it always breaks a guard and staggers.
    const guarded = d.blocking && d.canBlock && d.facingAttacker;
    const stun = d.poise === 'full' ? 0 : MOVES.bashStagger;
    return { outcome: guarded ? 'blockBreak' : 'hit', damage: Math.round(damage), stun, stagger: stun > 0, knockback: 4.5, hitPause: REACTION.hitPauseHeavy, attackerStagger: 0 };
  }
  const helmetMul = d.helmetless ? REACTION.helmetlessDamageMultiplier : 1;
  const shielded = d.blocking && d.canBlock && d.facingAttacker;
  if (shielded) {
    if (d.blockAge <= BLOCK.perfectWindow) {
      return { outcome: 'parried', damage: 0, stun: 0, stagger: false, knockback: 0.8, hitPause: REACTION.hitPauseParry, attackerStagger: REACTION.staggerParried };
    }
    if (kind === 'light') {
      return { outcome: 'blocked', damage: Math.round(damage * BLOCK.chipLight), stun: 0, stagger: false, knockback: 1.6, hitPause: REACTION.hitPauseLight * 0.7, attackerStagger: 0 };
    }
    const chip = kind === 'boss' ? BLOCK.chipBoss : BLOCK.chipHeavy;
    return {
      outcome: 'blockBreak',
      damage: Math.round(damage * chip * helmetMul),
      stun: REACTION.staggerBlockBreak,
      stagger: true,
      knockback: kind === 'boss' ? REACTION.knockbackBoss * 0.6 : REACTION.knockbackHeavy * 0.5,
      hitPause: REACTION.hitPauseHeavy,
      attackerStagger: 0,
    };
  }
  const heavy = kind !== 'light';
  let stun: number = heavy ? REACTION.hitstunHeavy : REACTION.hitstunLight;
  if (d.poise === 'full' || (d.poise === 'light' && !heavy)) stun = 0;
  return {
    outcome: 'hit',
    damage: Math.round(damage * helmetMul),
    stun,
    stagger: false,
    knockback: kind === 'boss' ? REACTION.knockbackBoss : heavy ? REACTION.knockbackHeavy : REACTION.knockbackLight,
    hitPause: heavy ? REACTION.hitPauseHeavy : REACTION.hitPauseLight,
    attackerStagger: 0,
  };
}

/** Resolve a projectile or hazard hit. Only blockable sources are stopped by the shield (spec §12). */
export function resolveProjectileHit(damage: number, blockable: boolean, d: DefenderState): HitResolution {
  if (d.invulnerable) return NONE;
  if (blockable && d.blocking && d.canBlock && d.facingAttacker) {
    return { outcome: 'blocked', damage: 0, stun: 0, stagger: false, knockback: 0.8, hitPause: 0, attackerStagger: 0 };
  }
  const helmetMul = d.helmetless ? REACTION.helmetlessDamageMultiplier : 1;
  return {
    outcome: 'hit',
    damage: Math.round(damage * helmetMul),
    stun: d.poise === 'none' ? REACTION.hitstunLight : 0,
    stagger: false,
    knockback: REACTION.knockbackLight * 0.7,
    hitPause: 0.03,
    attackerStagger: 0,
  };
}

/** Health → filled segment count (ceil, so a sliver of HP still shows a block). */
export function filledSegments(hp: number, maxHp: number, segments: number): number {
  if (hp <= 0) return 0;
  return Math.min(segments, Math.ceil((hp / maxHp) * segments - 1e-9));
}

export { ATTACK_TIMING };
