import { isAlive, isBusy } from '@/core/sim/fighter';
import type { BossModuleId } from '@/engines/duel/duel-config';
import { castNow, drainMana, type BossContext, type BossModule } from './boss-module';
import { castBeam, castFireball, castMagicVolley, hover, resolveStun, startQuake, startStun, summon, type PendingStun } from './spellcraft';

type Spell = 'fireball' | 'beam' | 'volley' | 'ghosts' | 'zombies' | 'trees' | 'stun' | 'quake';

/** Shared cadence logic: pick a spell when ready and the boss is free, then fire it on release. */
abstract class CasterModule implements BossModule {
  abstract readonly id: BossModuleId;
  protected pending: Spell | null = null;
  protected nextCast = 2.5;
  protected stun: PendingStun | null = null;

  abstract setup(ctx: BossContext): void;
  protected abstract choose(ctx: BossContext): Spell | null;
  protected abstract cooldown(ctx: BossContext): number;
  protected cost(_spell: Spell): number {
    return 0;
  }

  update(ctx: BossContext, dt: number) {
    const b = ctx.boss;
    if (!isAlive(b)) return;
    if (this.stun) {
      this.stun.t -= dt;
      if (this.stun.t <= 0) {
        resolveStun(ctx, this.stun);
        this.stun = null;
      }
    }
    this.nextCast -= dt;
    if (this.nextCast <= 0 && !isBusy(b) && !this.pending) {
      const spell = this.choose(ctx);
      if (spell) {
        this.pending = spell;
        castNow(b);
      }
      this.nextCast = this.cooldown(ctx);
    }
  }

  onCast(ctx: BossContext) {
    const spell = this.pending;
    this.pending = null;
    if (!spell) return;
    drainMana(ctx, this.cost(spell));
    switch (spell) {
      case 'fireball':
        castFireball(ctx);
        break;
      case 'beam':
        castBeam(ctx);
        break;
      case 'volley':
        castMagicVolley(ctx);
        break;
      case 'ghosts':
        summon(ctx, 'ghost', 2, 3);
        break;
      case 'zombies':
        summon(ctx, 'zombie', 2, 3);
        break;
      case 'trees':
        summon(ctx, 'haunted-tree', 2, 2);
        break;
      case 'stun':
        this.stun = startStun(ctx);
        break;
      case 'quake':
        startQuake(ctx, 1);
        break;
    }
  }
}

/** Mission 4: mounted knight with magic beams, fireballs and ghost summoning. */
class MysteriousKnightModule extends CasterModule {
  readonly id = 'mysterious-knight' as const;
  setup(_ctx: BossContext) {
    this.nextCast = 4;
  }
  protected cooldown(ctx: BossContext) {
    return ctx.world.rng.range(4.5, 7);
  }
  protected choose(ctx: BossContext): Spell {
    const r = ctx.world.rng.next();
    const ghostsAlive = ctx.minions().filter(isAlive).length;
    if (r < 0.25 && ghostsAlive < 2) return 'ghosts';
    return r < 0.62 ? 'beam' : 'fireball';
  }
}

/**
 * Mission 5: the Wizard cannot be attacked. Every spell drains mana; at zero he quits.
 * High mana: fireballs + beams. Medium: summons ghosts. Low: distorts terrain + haunted trees.
 * Destroying his summons drains extra mana, giving the player agency.
 */
class WizardModule extends CasterModule {
  readonly id = 'wizard' as const;
  setup(ctx: BossContext) {
    const b = ctx.boss;
    b.maxMana = 160;
    b.mana = 160;
    b.untargetable = true;
    b.controller = 'none';
    this.nextCast = 2.2;
  }
  private tier(ctx: BossContext) {
    const f = ctx.boss.mana / ctx.boss.maxMana;
    return f > 0.66 ? 'high' : f > 0.33 ? 'medium' : 'low';
  }
  protected cooldown(ctx: BossContext) {
    return ctx.world.rng.range(2.2, 3.3);
  }
  protected cost(spell: Spell) {
    return { fireball: 7, beam: 9, volley: 8, ghosts: 11, zombies: 10, trees: 12, stun: 8, quake: 14 }[spell];
  }
  protected choose(ctx: BossContext): Spell {
    const r = ctx.world.rng.next();
    const tier = this.tier(ctx);
    if (tier === 'high') return r < 0.55 ? 'fireball' : 'beam';
    if (tier === 'medium') return r < 0.5 && ctx.minions().filter(isAlive).length < 3 ? 'ghosts' : r < 0.8 ? 'fireball' : 'beam';
    if (!ctx.world.hazards.some((h) => h.kind === 'quake' && !h.dead) && r < 0.4) return 'quake';
    return r < 0.75 && ctx.minions().filter(isAlive).length < 3 ? 'trees' : 'fireball';
  }
  update(ctx: BossContext, dt: number) {
    hover(ctx, dt, 1.6, 8);
    ctx.world.distortion = this.tier(ctx) === 'low' ? 0.6 : 0;
    super.update(ctx, dt);
  }
  canBeHit() {
    return false;
  }
  onMinionKilled(ctx: BossContext) {
    drainMana(ctx, 5);
  }
  defeated(ctx: BossContext) {
    return ctx.boss.mana <= 0;
  }
  caption(ctx: BossContext) {
    return { high: 'Arcane fury', medium: 'Summoning the dead', low: 'Twisting the earth' }[this.tier(ctx)];
  }
}

/** Mission 8: magic projectiles and stun; zombies at lower health; terrain distortion at very low health. */
class WitchSpiritModule extends CasterModule {
  readonly id = 'witch-spirit' as const;
  private laughed = false;
  setup(ctx: BossContext) {
    ctx.boss.controller = 'caster';
    this.nextCast = 2.5;
  }
  protected cooldown(ctx: BossContext) {
    return ctx.world.rng.range(2.8, 4.2);
  }
  protected choose(ctx: BossContext): Spell {
    const hp = ctx.boss.hp / ctx.boss.maxHp;
    const r = ctx.world.rng.next();
    if (hp < 0.2 && !ctx.world.hazards.some((h) => h.kind === 'quake' && !h.dead)) return 'quake';
    if (hp < 0.5 && r < 0.3 && ctx.minions().filter(isAlive).length < 3) return 'zombies';
    return r < 0.55 ? 'volley' : 'stun';
  }
  update(ctx: BossContext, dt: number) {
    hover(ctx, dt, 0.8, 6);
    if (!this.laughed && ctx.boss.hp < ctx.boss.maxHp * 0.5) {
      this.laughed = true;
      ctx.world.emit({ type: 'laugh', x: ctx.boss.x, who: 'witch' });
      ctx.banner('The Witch Spirit calls the dead!');
    }
    ctx.world.distortion = ctx.boss.hp < ctx.boss.maxHp * 0.2 ? 0.5 : 0;
    super.update(ctx, dt);
  }
}

/**
 * Mission 10 extra boss: tag-team 2v1. Damage dealt drains her mana; spells cost mana; stuns force a tag-in
 * (handled by the Duel engine on the 'stun' event). The fight ends when mana reaches zero.
 */
class EvilWitchModule extends CasterModule {
  readonly id = 'evil-witch' as const;
  setup(ctx: BossContext) {
    const b = ctx.boss;
    b.maxMana = 200;
    b.mana = 200;
    b.controller = 'caster';
    this.nextCast = 2;
  }
  protected cooldown(ctx: BossContext) {
    return ctx.world.rng.range(2.4, 3.6);
  }
  protected cost(spell: Spell) {
    return { fireball: 4, beam: 5, volley: 5, ghosts: 8, zombies: 8, trees: 8, stun: 6, quake: 10 }[spell];
  }
  protected choose(ctx: BossContext): Spell {
    const r = ctx.world.rng.next();
    if (r < 0.3) return 'stun';
    if (r < 0.45 && ctx.minions().filter(isAlive).length < 2) return 'zombies';
    return r < 0.75 ? 'volley' : 'fireball';
  }
  update(ctx: BossContext, dt: number) {
    hover(ctx, dt, 0.3, 4.5);
    super.update(ctx, dt);
  }
  onBossDamaged(ctx: BossContext, amount: number) {
    // Her life force is her mana: wounds drain it, the body itself cannot fall.
    ctx.boss.hp = ctx.boss.maxHp;
    drainMana(ctx, amount * 0.7);
  }
  defeated(ctx: BossContext) {
    return ctx.boss.mana <= 0;
  }
  caption() {
    return 'Strike her to drain her mana';
  }
}

export function createBossModule(id: BossModuleId): BossModule {
  switch (id) {
    case 'mysterious-knight':
      return new MysteriousKnightModule();
    case 'wizard':
      return new WizardModule();
    case 'witch-spirit':
      return new WitchSpiritModule();
    case 'evil-witch':
      return new EvilWitchModule();
  }
}
