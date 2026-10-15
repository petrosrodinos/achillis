import { hurtbox, isAlive } from './fighter';
import type { World } from './world';

/** Integrates projectiles, resolves fighter hits (shield blocks only blockable kinds) and ground impacts. */
export function updateProjectiles(world: World, dt: number) {
  for (const p of world.projectiles) {
    if (p.dead) continue;
    if (p.stuck > 0) {
      p.stuck -= dt;
      if (p.stuck <= 0) p.dead = true;
      continue;
    }
    p.ttl -= dt;
    if (p.ttl <= 0) {
      p.dead = true;
      continue;
    }
    if (p.homing > 0) {
      const target = world.player;
      if (target && isAlive(target)) {
        const dx = target.x - p.x;
        const dy = target.y + 1.2 - p.y;
        const len = Math.hypot(dx, dy) || 1;
        const speed = Math.hypot(p.vx, p.vy);
        p.vx += ((dx / len) * speed - p.vx) * Math.min(1, p.homing * dt);
        p.vy += ((dy / len) * speed - p.vy) * Math.min(1, p.homing * dt);
      }
    }
    p.vy -= p.gravity * dt;
    p.x += p.vx * dt;
    p.y += p.vy * dt;

    // Fighter collision.
    for (const f of world.fighters) {
      if (f.team === p.team || !isAlive(f) || f.untargetable) continue;
      const hb = hurtbox(f);
      if (p.x + p.radius < hb.x0 || p.x - p.radius > hb.x1 || p.y + p.radius < hb.y0 || p.y - p.radius > hb.y1) continue;
      const res = world.hurt(f, p.damage, p.blockable, p.x - Math.sign(p.vx) * 2, p.ownerId);
      if (res === 'ignored') continue;
      world.emit({ type: 'impact', x: p.x, y: p.y, kind: p.kind, blocked: res === 'blocked', hitFighter: true });
      if (res === 'blocked' && (p.kind === 'arrow' || p.kind === 'spear' || p.kind === 'javelin')) {
        // Deflect off the shield and fall.
        p.vx = -p.vx * 0.25;
        p.vy = 3;
        p.gravity = 20;
        p.team = -1 as unknown as 0;
        p.ttl = 0.8;
      } else {
        p.dead = true;
      }
      break;
    }
    if (p.dead) continue;

    const floor = 0;
    if (p.y <= floor && p.vy < 0) {
      world.emit({ type: 'impact', x: p.x, y: floor, kind: p.kind, blocked: false, hitFighter: false });
      if (p.kind === 'arrow' || p.kind === 'spear' || p.kind === 'javelin') {
        p.y = floor;
        p.stuck = 2.5;
      } else {
        p.dead = true;
      }
    }
  }
}
