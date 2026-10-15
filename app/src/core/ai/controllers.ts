import { DIFFICULTY } from '@/core/combat/combat-config';
import { attackPhase, isAlive, isAttacking, reachOf } from '@/core/sim/fighter';
import { emptyIntent, type Fighter, type Intent } from '@/core/sim/types';
import type { World } from '@/core/sim/world';

/**
 * AI controllers write a Fighter's `intent` each step. Decisions are re-evaluated on a reaction
 * timer (scaled by difficulty) so the AI is beatable and readable, never frame-perfect.
 */
export interface AiContext {
  world: World;
  dt: number;
  /** Max simultaneous melee attackers on one target (readability, beat-em-up style). */
  maxAttackers: number;
  /** Optional per-fighter override target (open-field orders, escorts). */
  targetOverride?: (f: Fighter) => Fighter | null | undefined;
  /** Optional move target (open-field orders): fighters walk here when no enemy is engaged. */
  moveTarget?: (f: Fighter) => number | null;
}

type Controller = (f: Fighter, ctx: AiContext, out: Intent) => void;

const skillOf = (ctx: AiContext) => DIFFICULTY[ctx.world.difficulty].aiSkill;

export function nearestEnemy(world: World, f: Fighter, maxDist = Infinity): Fighter | null {
  let best: Fighter | null = null;
  let bestD = maxDist;
  for (const o of world.fighters) {
    if (o.team === f.team || !isAlive(o) || o.untargetable) continue;
    if (o.look.model === 'bird') continue;
    const d = Math.abs(o.x - f.x) + Math.abs(o.y - f.y) * 0.5;
    // Prefer the player slightly so enemies focus the hero in quests.
    const bias = o.isPlayer ? -1.5 : 0;
    if (d + bias < bestD) {
      bestD = d + bias;
      best = o;
    }
  }
  return best;
}

function targetOf(f: Fighter, ctx: AiContext): Fighter | null {
  if (ctx.targetOverride) {
    // undefined = default targeting, null = deliberately no target (e.g. retreating units).
    const t = ctx.targetOverride(f);
    if (t !== undefined) return t && isAlive(t) ? t : null;
  }
  const cached = f.ai.target !== undefined ? ctx.world.byId(f.ai.target) : undefined;
  if (cached && isAlive(cached) && (f.ai.retarget ?? 0) > ctx.world.time) return cached;
  const n = nearestEnemy(ctx.world, f);
  f.ai.target = n?.id ?? -1;
  f.ai.retarget = ctx.world.time + 0.6;
  return n;
}

/** Whether `t` is winding up an attack that will reach `f`. */
function threatOf(t: Fighter, f: Fighter): 'light' | 'heavy' | 'ranged' | null {
  if (!isAttacking(t)) return null;
  const ph = attackPhase(t);
  if (!ph || (ph.phase !== 'anticipation' && ph.phase !== 'swing')) return null;
  const dist = Math.abs(t.x - f.x);
  if (t.action === 'shoot' || t.action === 'throw' || t.action === 'cast') return 'ranged';
  if (dist > reachOf(t) + 0.8) return null;
  if ((f.x - t.x) * t.facing < 0) return null;
  return t.action === 'light' ? 'light' : 'heavy';
}

/** Attack-token bookkeeping so only N melee enemies engage a target at once. */
function hasToken(f: Fighter, target: Fighter, ctx: AiContext): boolean {
  if (!target.isPlayer) return true;
  const engaged = ctx.world.fighters.filter((o) => o.team === f.team && isAlive(o) && o.ai.engaging === target.id && o.id !== f.id).length;
  if (f.ai.engaging === target.id) return true;
  if (engaged < ctx.maxAttackers) {
    f.ai.engaging = target.id;
    return true;
  }
  return false;
}

function releaseToken(f: Fighter) {
  f.ai.engaging = -1;
}

function face(f: Fighter, t: Fighter, out: Intent) {
  // Turning is done through a tiny move impulse when idle; set facing directly for AI clarity.
  if (!isAttacking(f) && f.action !== 'dodge') f.facing = t.x >= f.x ? 1 : -1;
  void out;
}

function reactionReady(f: Fighter, ctx: AiContext, base = 0.32): boolean {
  if ((f.ai.react ?? 0) > ctx.world.time) return false;
  const skill = skillOf(ctx);
  f.ai.react = ctx.world.time + base * (1.6 - skill) * ctx.world.rng.range(0.7, 1.3);
  return true;
}

/** Knight-class opponent used in duels: spacing, feints, blocks and dodges. */
const duelist: Controller = (f, ctx, out) => {
  const t = targetOf(f, ctx);
  if (!t) return;
  const w = ctx.world;
  const skill = skillOf(ctx) * (f.isBoss ? 1.1 : 1);
  const dx = t.x - f.x;
  const dist = Math.abs(dx);
  const dir = Math.sign(dx) || 1;
  const reach = reachOf(f);
  face(f, t, out);

  // Defensive reactions to incoming attacks.
  const threat = threatOf(t, f);
  if (threat && (f.ai.defending ?? 0) < w.time) {
    if (reactionReady(f, ctx, 0.12)) {
      const r = w.rng.next();
      if (threat === 'heavy' && f.stats.canDodge && r < 0.45 * skill) {
        out.dodge = true;
        out.moveX = -dir;
        f.ai.defending = w.time + 0.4;
        return;
      }
      if (f.stats.canBlock && r < (threat === 'light' ? 0.62 : 0.3) * skill) {
        f.ai.defending = w.time + 0.45;
        f.ai.blockUntil = w.time + w.rng.range(0.35, 0.6);
      }
    }
  }
  if ((f.ai.blockUntil ?? 0) > w.time) {
    out.block = true;
    return;
  }

  // Punish a staggered/recovering player.
  const opening = t.action === 'stagger' || t.action === 'hit' || (isAttacking(t) && attackPhase(t)?.phase === 'recovery');

  const desired = reach * 0.8;
  // Guard-break a turtling opponent with a shield bash.
  if (t.action === 'block' && dist < 1.4 && f.stats.canBlock && f.look.model === 'humanoid' && !f.mounted && (f.ai.nextBash ?? 0) < w.time) {
    f.ai.nextBash = w.time + w.rng.range(2.5, 4.5);
    if (w.rng.chance(0.55 * skill)) {
      out.block = true;
      out.light = true;
      return;
    }
  }
  if ((f.ai.nextAttack ?? 0) < w.time && dist < reach + 0.15) {
    const heavyChance = opening ? 0.55 : 0.28;
    if (w.rng.next() < heavyChance) out.heavy = true;
    else out.light = true;
    // Combo follow-ups are handled by buffered lights during recovery.
    f.ai.combo = w.rng.chance(0.35 * skill) ? 1 : 0;
    f.ai.nextAttack = w.time + w.rng.range(0.55, 1.3) / (0.6 + skill * 0.6);
    return;
  }
  if (f.ai.combo && f.action === 'light') {
    const ph = attackPhase(f);
    if (ph?.phase === 'recovery') {
      out.light = true;
      f.ai.combo = 0;
    }
  }

  // Spacing: approach to striking range, sometimes back off, circle with small steps.
  if ((f.ai.strafeUntil ?? 0) > w.time) {
    out.moveX = f.ai.strafeDir ?? 0;
  } else if (dist > desired + 0.4) {
    out.moveX = dir;
  } else if (dist < desired - 0.7) {
    out.moveX = -dir;
  } else if (w.rng.chance(0.02)) {
    f.ai.strafeUntil = w.time + w.rng.range(0.2, 0.5);
    f.ai.strafeDir = w.rng.chance(0.6) ? -dir : dir;
  }
  if (f.mounted === 'horse' && dist < 1.2) out.moveX = -dir;
};

/** Generic footsoldier: approach with attack tokens, strike, occasional block. */
const melee: Controller = (f, ctx, out) => {
  const t = targetOf(f, ctx);
  if (!t) {
    const mt = ctx.moveTarget?.(f);
    if (mt !== null && mt !== undefined && Math.abs(mt - f.x) > 0.5) out.moveX = Math.sign(mt - f.x);
    return;
  }
  const w = ctx.world;
  const skill = skillOf(ctx);
  const dx = t.x - f.x;
  const dist = Math.abs(dx);
  const dir = Math.sign(dx) || 1;
  const reach = reachOf(f);
  face(f, t, out);
  if (dist > 14 && ctx.moveTarget) {
    const mt = ctx.moveTarget(f);
    if (mt !== null) {
      out.moveX = Math.abs(mt - f.x) > 0.5 ? Math.sign(mt - f.x) : 0;
      return;
    }
  }
  const token = hasToken(f, t, ctx);
  const threat = threatOf(t, f);
  if (threat === 'light' && f.stats.canBlock && reactionReady(f, ctx, 0.25) && w.rng.chance(0.35 * skill)) f.ai.blockUntil = w.time + 0.4;
  if ((f.ai.blockUntil ?? 0) > w.time) {
    out.block = true;
    return;
  }
  if (!token) {
    // Wait at a respectful distance, shuffling.
    const hold = 3.2 + (f.id % 3) * 0.7;
    if (dist < hold - 0.5) out.moveX = -dir;
    else if (dist > hold + 0.5) out.moveX = dir;
    return;
  }
  if (dist <= reach + 0.1) {
    if ((f.ai.nextAttack ?? 0) < w.time) {
      if (w.rng.chance(0.2)) out.heavy = true;
      else out.light = true;
      // Footsoldiers attack at a readable rhythm so the player can block, dodge and counter.
      f.ai.nextAttack = w.time + w.rng.range(1.5, 2.8) / (0.6 + skill * 0.5);
    } else if (dist < reach * 0.5) out.moveX = -dir;
  } else {
    out.moveX = dir;
  }
};

/** Spearmen keep mid-range and throw spears/javelins, then close in. */
const spearman: Controller = (f, ctx, out) => {
  const t = targetOf(f, ctx);
  if (!t) return melee(f, ctx, out);
  const w = ctx.world;
  const dist = Math.abs(t.x - f.x);
  face(f, t, out);
  if (f.stats.ranged && dist > 5 && dist < 12 && (f.ai.nextThrow ?? 1.5) < w.time && !isAttacking(f)) {
    out.special = 'throw';
    f.ai.nextThrow = w.time + w.rng.range(3.5, 6);
    return;
  }
  melee(f, ctx, out);
};

/** Archers keep their distance and loose arrows; flee when approached. */
const archer: Controller = (f, ctx, out) => {
  const t = targetOf(f, ctx);
  if (!t) return;
  const w = ctx.world;
  const dx = t.x - f.x;
  const dist = Math.abs(dx);
  const dir = Math.sign(dx) || 1;
  face(f, t, out);
  if (isAttacking(f)) return;
  const pref = 8 + (f.id % 4);
  if (dist < 3.2) {
    // Cornered: flee, or swipe if stuck at the edge.
    out.moveX = -dir;
    if ((f.x <= w.bounds.minX - 5 || f.x >= w.bounds.maxX + 5 || w.rng.chance(0.02)) && dist < 1.8) out.light = true;
    return;
  }
  if ((f.ai.nextShot ?? w.time + w.rng.range(0.6, 1.8)) < w.time && dist < 18) {
    out.special = 'shoot';
    f.ai.nextShot = w.time + w.rng.range(2.0, 3.4);
    return;
  }
  if (f.ai.nextShot === undefined) f.ai.nextShot = w.time + w.rng.range(0.6, 1.8);
  if (dist < pref - 1.5) out.moveX = -dir;
  else if (dist > pref + 3) out.moveX = dir;
};

/** Fast hit-and-run attackers (bandits, servants). */
const skirmisher: Controller = (f, ctx, out) => {
  const t = targetOf(f, ctx);
  if (!t) return;
  const w = ctx.world;
  const dist = Math.abs(t.x - f.x);
  const dir = Math.sign(t.x - f.x) || 1;
  face(f, t, out);
  if ((f.ai.retreatUntil ?? 0) > w.time) {
    out.moveX = -dir;
    return;
  }
  if (!hasToken(f, t, ctx)) {
    const hold = 3.5 + (f.id % 3) * 0.6;
    out.moveX = dist < hold ? -dir : dist > hold + 1 ? dir : 0;
    return;
  }
  if (dist <= reachOf(f) && (f.ai.nextAttack ?? 0) < w.time) {
    out.light = true;
    f.ai.nextAttack = w.time + w.rng.range(1.2, 2.2);
    if (w.rng.chance(0.4)) {
      f.ai.retreatUntil = w.time + w.rng.range(0.5, 0.9);
      releaseToken(f);
    }
  } else if (dist > reachOf(f) * 0.8) out.moveX = dir;
};

/** Slow heavy hitters (vikings, zombies, troll). */
const brute: Controller = (f, ctx, out) => {
  const t = targetOf(f, ctx);
  if (!t) return;
  const w = ctx.world;
  const dist = Math.abs(t.x - f.x);
  const dir = Math.sign(t.x - f.x) || 1;
  face(f, t, out);
  if (!f.isBoss && !hasToken(f, t, ctx)) {
    out.moveX = dist < 3.5 ? -dir : dist > 4.5 ? dir : 0;
    return;
  }
  if (dist <= reachOf(f) + 0.1) {
    if ((f.ai.nextAttack ?? 0) < w.time) {
      if (w.rng.chance(f.isBoss ? 0.5 : 0.4)) out.heavy = true;
      else out.light = true;
      f.ai.nextAttack = w.time + (f.isBoss ? w.rng.range(1.0, 2.0) : w.rng.range(1.6, 2.8));
    }
  } else out.moveX = dir;
};

/** Wolves and boars: circle, then lunge (heavy) from mid range. */
const beast: Controller = (f, ctx, out) => {
  const t = targetOf(f, ctx);
  if (!t) return;
  const w = ctx.world;
  const dist = Math.abs(t.x - f.x);
  const dir = Math.sign(t.x - f.x) || 1;
  face(f, t, out);
  if (isAttacking(f)) return;
  if ((f.ai.retreatUntil ?? 0) > w.time) {
    out.moveX = -dir;
    return;
  }
  if (dist < 2.6 && (f.ai.nextAttack ?? 0) < w.time) {
    if (w.rng.chance(0.5)) out.heavy = true;
    else out.light = true;
    f.ai.nextAttack = w.time + w.rng.range(1.0, 1.8);
    f.ai.retreatUntil = w.time + 0.9 + w.rng.range(0, 0.6);
  } else out.moveX = dist > 2.0 ? dir : 0;
};

/** Ghosts float and drift through, striking with spectral swipes. */
const ghost: Controller = (f, ctx, out) => {
  const t = targetOf(f, ctx);
  if (!t) return;
  const w = ctx.world;
  const dist = Math.abs(t.x - f.x);
  const dir = Math.sign(t.x - f.x) || 1;
  face(f, t, out);
  const hover = 0.35 + Math.sin(w.time * 2 + f.id) * 0.25;
  f.y += (hover - f.y) * Math.min(1, ctx.dt * 3);
  if (dist <= reachOf(f) && (f.ai.nextAttack ?? 0) < w.time) {
    out.light = true;
    f.ai.nextAttack = w.time + w.rng.range(1.0, 1.8);
  } else if (dist > reachOf(f) * 0.7) out.moveX = dir * 0.9;
};

/** Birds fly across, then dive at the rider. Contact damage does the rest. */
const bird: Controller = (f, ctx, out) => {
  const w = ctx.world;
  const p = w.player;
  if (!p) return;
  if (f.ai.mode === undefined) {
    f.ai.mode = 0;
    f.ai.dir = p.x < f.x ? -1 : 1;
  }
  const dir = f.ai.dir as number;
  f.facing = dir > 0 ? 1 : -1;
  // Steer: direct flight, then dive toward player altitude when near.
  const dx = (p.x - f.x) * dir;
  const targetY = dx > 0 && dx < 10 ? p.y + 1 : f.ai.cruiseY ?? (f.ai.cruiseY = f.y);
  f.vy += (targetY - f.y) * ctx.dt * 2.5 - f.vy * ctx.dt * 1.5;
  out.moveX = dir;
  if (f.x < w.bounds.minX - 30 || f.x > w.bounds.maxX + 30) f.removed = true;
};

/** Haunted trees are rooted; they swipe at anything in reach. */
const tree: Controller = (f, ctx, out) => {
  const t = targetOf(f, ctx);
  if (!t) return;
  const w = ctx.world;
  if (f.action === 'rise') return;
  const dist = Math.abs(t.x - f.x);
  f.facing = t.x >= f.x ? 1 : -1;
  if (dist <= reachOf(f) && (f.ai.nextAttack ?? 0) < w.time) {
    out.heavy = true;
    f.ai.nextAttack = w.time + w.rng.range(1.6, 2.6);
  }
};

/** Allies fight the nearest enemy, otherwise follow the player. */
const ally: Controller = (f, ctx, out) => {
  const w = ctx.world;
  const enemyNear = nearestEnemy(w, f, 9);
  if (enemyNear) return duelist(f, ctx, out);
  const p = w.player;
  if (!p) return;
  const want = p.x - p.facing * 2.2;
  if (Math.abs(want - f.x) > 0.8) out.moveX = Math.sign(want - f.x);
};

/** Escort targets follow the player at a distance and avoid enemies. */
const escort: Controller = (f, ctx, out) => {
  const w = ctx.world;
  const p = w.player;
  if (!p) return;
  const threat = nearestEnemy(w, f, 3);
  if (threat) {
    const dir = Math.sign(threat.x - f.x) || 1;
    // Defend if cornered, else back away toward the player.
    if (Math.abs(threat.x - f.x) < 1.6 && (f.ai.nextAttack ?? 0) < w.time) {
      f.facing = dir > 0 ? 1 : -1;
      out.light = true;
      f.ai.nextAttack = w.time + 1.4;
    } else out.moveX = -dir;
    return;
  }
  const want = p.x - 3;
  if (Math.abs(want - f.x) > 1.2) out.moveX = Math.sign(want - f.x) * 0.8;
};

/** Casters with no boss module just keep distance (boss modules drive their spells). */
const caster: Controller = (f, ctx, out) => {
  const t = targetOf(f, ctx);
  if (!t) return;
  const dist = Math.abs(t.x - f.x);
  const dir = Math.sign(t.x - f.x) || 1;
  f.facing = dir > 0 ? 1 : -1;
  if (dist < 5) out.moveX = -dir;
  else if (dist > 9) out.moveX = dir * 0.6;
};

export const CONTROLLERS: Record<string, Controller> = {
  duelist, melee, spearman, archer, skirmisher, brute, beast, ghost, bird, tree, ally, escort, caster,
  none: () => {},
};

/** Write intents for every AI-controlled fighter. */
export function runAi(ctx: AiContext) {
  for (const f of ctx.world.fighters) {
    if (f.isPlayer || f.removed || f.action === 'dead' || f.controller === 'player') continue;
    const out = emptyIntent();
    if (f.action !== 'stunned') (CONTROLLERS[f.controller] ?? melee)(f, ctx, out);
    f.intent = out;
  }
}
