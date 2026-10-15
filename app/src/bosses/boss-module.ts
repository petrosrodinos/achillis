import type { EnemyLookId } from '@/content/fighters';
import type { Fighter } from '@/core/sim/types';
import type { World } from '@/core/sim/world';
import type { BossModuleId } from '@/engines/duel/duel-config';

/** What a boss behaviour module can see and do. Provided by the Duel engine. */
export interface BossContext {
  world: World;
  boss: Fighter;
  /** Currently active player-side fighter. */
  player(): Fighter | undefined;
  spawnMinion(look: EnemyLookId, x: number, y?: number): Fighter;
  minions(): Fighter[];
  arena: { minX: number; maxX: number };
  banner(title: string, subtitle?: string): void;
}

/**
 * Pluggable special-rule boss behaviour (spec §14, Core Design Rule 2). Modules never contain
 * mission-specific code; missions select a module by id in their Duel config.
 */
export interface BossModule {
  readonly id: BossModuleId;
  setup(ctx: BossContext): void;
  /** Runs after generic AI wrote the boss intent; may override it. */
  update(ctx: BossContext, dt: number): void;
  /** The boss released a 'cast' action. */
  onCast?(ctx: BossContext): void;
  /** Return false to make the boss immune to an attack. */
  canBeHit?(ctx: BossContext, attacker: Fighter | null): boolean;
  onBossDamaged?(ctx: BossContext, amount: number): void;
  onMinionKilled?(ctx: BossContext, minion: Fighter): void;
  /** Mana victory condition. */
  defeated?(ctx: BossContext): boolean;
  caption?(ctx: BossContext): string | undefined;
}

/** Helper to make the boss start a cast this step. */
export function castNow(boss: Fighter) {
  boss.intent.special = 'cast';
  boss.intent.light = false;
  boss.intent.heavy = false;
  boss.intent.block = false;
}

export function drainMana(ctx: BossContext, amount: number) {
  const b = ctx.boss;
  if (b.maxMana <= 0) return;
  b.mana = Math.max(0, b.mana - amount);
  ctx.world.emit({ type: 'mana-drain', amount });
}
