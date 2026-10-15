import { describe, expect, it } from 'vitest';
import { ATTACK_TIMING, BLOCK, DAMAGE, HEALTH, REACTION, segmentsFor } from './combat-config';
import { attackPhaseAt, filledSegments, isHitActive, resolveMeleeHit, resolveProjectileHit, timingTotal, type DefenderState } from './combat-math';

const open: DefenderState = { blocking: false, blockAge: 0, facingAttacker: true, invulnerable: false, helmetless: false, poise: 'none', canBlock: true };

describe('health segments', () => {
  it('maps HP pools to the spec block counts', () => {
    expect(segmentsFor(HEALTH.playerFoot)).toBe(4);
    expect(segmentsFor(HEALTH.playerMounted)).toBe(6);
    expect(segmentsFor(HEALTH.unitFoot)).toBe(3);
    expect(segmentsFor(HEALTH.unitMounted)).toBe(5);
  });
  it('rounds partially filled blocks up', () => {
    expect(filledSegments(100, 100, 4)).toBe(4);
    expect(filledSegments(76, 100, 4)).toBe(4);
    expect(filledSegments(75, 100, 4)).toBe(3);
    expect(filledSegments(1, 100, 4)).toBe(1);
    expect(filledSegments(0, 100, 4)).toBe(0);
  });
});

describe('attack phases', () => {
  it('walks anticipation → swing → impact → recovery and maps to the clip timeline', () => {
    const t = ATTACK_TIMING.heavy;
    const total = timingTotal(t);
    expect(attackPhaseAt(t, 0).phase).toBe('anticipation');
    expect(attackPhaseAt(t, t.anticipation + 0.001).phase).toBe('swing');
    expect(attackPhaseAt(t, t.anticipation + t.swing + 0.001).phase).toBe('impact');
    expect(attackPhaseAt(t, total - 0.01).phase).toBe('recovery');
    expect(attackPhaseAt(t, total + 0.01).phase).toBe('done');
    expect(attackPhaseAt(t, t.anticipation).clipT).toBeCloseTo(0.35, 2);
    expect(attackPhaseAt(t, t.anticipation + t.swing + t.impact).clipT).toBeCloseTo(0.6, 2);
  });
  it('scales with attack speed', () => {
    expect(timingTotal(ATTACK_TIMING.light, 2)).toBeCloseTo(timingTotal(ATTACK_TIMING.light) / 2);
  });
  it('only registers hits late in the swing and during impact', () => {
    expect(isHitActive('anticipation', 0.9)).toBe(false);
    expect(isHitActive('swing', 0.2)).toBe(false);
    expect(isHitActive('swing', 0.8)).toBe(true);
    expect(isHitActive('impact', 0)).toBe(true);
    expect(isHitActive('recovery', 0)).toBe(false);
  });
});

describe('melee resolution', () => {
  it('applies spec damage to an open defender', () => {
    expect(resolveMeleeHit('light', DAMAGE.light, open)).toMatchObject({ outcome: 'hit', damage: 10 });
    expect(resolveMeleeHit('heavy', DAMAGE.heavy, open)).toMatchObject({ outcome: 'hit', damage: 25 });
    expect(resolveMeleeHit('boss', DAMAGE.boss, open)).toMatchObject({ outcome: 'hit', damage: 35 });
  });
  it('blocks light attacks completely', () => {
    const r = resolveMeleeHit('light', 10, { ...open, blocking: true, blockAge: 1 });
    expect(r.outcome).toBe('blocked');
    expect(r.damage).toBe(0);
  });
  it('heavy attacks break a block and stagger', () => {
    const r = resolveMeleeHit('heavy', 25, { ...open, blocking: true, blockAge: 1 });
    expect(r.outcome).toBe('blockBreak');
    expect(r.stagger).toBe(true);
    expect(r.damage).toBe(Math.round(25 * BLOCK.chipHeavy));
  });
  it('a freshly raised shield parries and staggers the attacker', () => {
    const r = resolveMeleeHit('heavy', 25, { ...open, blocking: true, blockAge: 0.05 });
    expect(r.outcome).toBe('parried');
    expect(r.attackerStagger).toBeGreaterThan(0);
  });
  it('shields do not work from behind', () => {
    expect(resolveMeleeHit('light', 10, { ...open, blocking: true, blockAge: 1, facingAttacker: false }).outcome).toBe('hit');
  });
  it('dodge invulnerability ignores the hit', () => {
    expect(resolveMeleeHit('heavy', 25, { ...open, invulnerable: true }).outcome).toBe('ignored');
  });
  it('helmetless fighters take extra damage', () => {
    expect(resolveMeleeHit('light', 10, { ...open, helmetless: true }).damage).toBe(Math.round(10 * REACTION.helmetlessDamageMultiplier));
  });
  it('poise suppresses hitstun', () => {
    expect(resolveMeleeHit('light', 10, { ...open, poise: 'light' }).stun).toBe(0);
    expect(resolveMeleeHit('heavy', 25, { ...open, poise: 'light' }).stun).toBeGreaterThan(0);
    expect(resolveMeleeHit('heavy', 25, { ...open, poise: 'full' }).stun).toBe(0);
  });
});

describe('projectile resolution (spec §12)', () => {
  const shield = { ...open, blocking: true, blockAge: 1 };
  it('the shield stops blockable projectiles', () => {
    expect(resolveProjectileHit(DAMAGE.arrow, true, shield).outcome).toBe('blocked');
    expect(resolveProjectileHit(DAMAGE.spear, true, shield).outcome).toBe('blocked');
  });
  it('magic and fireballs pass through the shield', () => {
    expect(resolveProjectileHit(DAMAGE.magic, false, shield)).toMatchObject({ outcome: 'hit', damage: 25 });
  });
  it('everything can be dodged', () => {
    expect(resolveProjectileHit(DAMAGE.magic, false, { ...open, invulnerable: true }).outcome).toBe('ignored');
  });
});
