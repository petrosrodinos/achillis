import { DAMAGE } from '@/core/combat/combat-config';
import { isAlive, setAction } from '@/core/sim/fighter';
import type { Fighter } from '@/core/sim/types';
import type { BossContext } from './boss-module';

/** Reusable spells shared by all caster boss modules. */

export function castFireball(ctx: BossContext, homing = 0.6) {
  const p = ctx.player();
  if (!p) return;
  ctx.world.fireProjectile(ctx.boss, 'fireball', p.x, p.y + 1.1, { homing });
}

export function castMagicVolley(ctx: BossContext, count = 3) {
  const p = ctx.player();
  if (!p) return;
  for (let i = 0; i < count; i++) {
    const spread = (i - (count - 1) / 2) * 1.2;
    ctx.world.fireProjectile(ctx.boss, 'magic', p.x + spread * 2, p.y + 1.0 + spread, { speed: 7 + i * 0.6, homing: 0.25 });
  }
}

/** Horizontal beam at the player's height, telegraphed so it can be dodged (unblockable). */
export function castBeam(ctx: BossContext) {
  const p = ctx.player();
  if (!p) return;
  const b = ctx.boss;
  const dir = p.x >= b.x ? 1 : -1;
  const y = b.mounted === 'horse' ? 2.3 : p.mounted === 'horse' ? 2.2 : 1.2;
  ctx.world.addHazard({ kind: 'beam', x: b.x + dir * 0.8, y, width: 20, warn: 0.75, active: 0.35, rest: 0, dir, power: 0, damage: DAMAGE.beam, team: b.team });
}

export function summon(ctx: BossContext, look: 'ghost' | 'zombie' | 'haunted-tree', count: number, cap: number) {
  const alive = ctx.minions().filter((m) => isAlive(m)).length;
  const n = Math.min(count, cap - alive);
  const p = ctx.player();
  for (let i = 0; i < n; i++) {
    let x: number;
    if (look === 'haunted-tree' && p) {
      x = Math.max(ctx.arena.minX + 1, Math.min(ctx.arena.maxX - 1, p.x + (i % 2 === 0 ? 3.5 : -3.5)));
    } else {
      x = i % 2 === 0 ? ctx.arena.minX + 0.5 : ctx.arena.maxX - 0.5;
    }
    const m = ctx.spawnMinion(look, x, look === 'ghost' ? 0.6 : 0);
    if (look === 'haunted-tree') setAction(m, 'rise', 1.0);
    ctx.world.emit({ type: 'summon', x, y: 0, what: look });
  }
  return n;
}

/** Stun ring under the player: telegraphed, dodgeable; locks movement briefly (spec §14). */
export interface PendingStun {
  x: number;
  t: number;
}

export function startStun(ctx: BossContext): PendingStun | null {
  const p = ctx.player();
  if (!p) return null;
  ctx.world.addHazard({ kind: 'lightning', x: p.x, y: 0, width: 0, warn: 0.75, active: 0, rest: 0, dir: 0, power: 0, damage: 0, team: ctx.boss.team, variant: 'stun' });
  return { x: p.x, t: 0.75 };
}

export function resolveStun(ctx: BossContext, s: PendingStun): boolean {
  const p = ctx.player();
  if (!p || !isAlive(p)) return false;
  const def = ctx.world.defenderState(p, ctx.boss.x);
  if (Math.abs(p.x - s.x) > 1.3 || def.invulnerable) {
    if (p.action === 'dodge') {
      ctx.world.stats.dodges++;
      ctx.world.emit({ type: 'dodge-avoid', x: p.x, y: p.y + 1.2 });
    }
    return false;
  }
  setAction(p, 'stunned', 1.3);
  p.bufferedAction = null;
  ctx.world.emit({ type: 'stun', x: p.x, y: p.y + 2 });
  return true;
}

export function startQuake(ctx: BossContext, power = 1) {
  if (ctx.world.hazards.some((h) => h.kind === 'quake' && !h.dead)) return;
  ctx.world.addHazard({ kind: 'quake', x: 0, y: 0, width: 0, warn: 0, active: 0, rest: 0, dir: 0, power, damage: 0, team: ctx.boss.team });
}

/** Keep a hovering caster at a comfortable distance and altitude. */
export function hover(ctx: BossContext, dt: number, altitude: number, keepAway = 7) {
  const b: Fighter = ctx.boss;
  const p = ctx.player();
  b.y += (altitude + Math.sin(ctx.world.time * 1.6) * 0.25 - b.y) * Math.min(1, dt * 2);
  b.vy = 0;
  if (!p) return;
  b.facing = p.x >= b.x ? 1 : -1;
  const d = p.x - b.x;
  if (Math.abs(d) < keepAway) b.intent.moveX = -Math.sign(d) || 1;
  else if (Math.abs(d) > keepAway + 5) b.intent.moveX = Math.sign(d) * 0.5;
  else b.intent.moveX = 0;
  // Never fight in melee.
  b.intent.light = false;
  b.intent.heavy = false;
}
