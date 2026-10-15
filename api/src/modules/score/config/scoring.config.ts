import { DifficultyId, EnemyType } from '@/shared/constants/game.constants';

/**
 * Single source of truth for all scoring weights (spec §17.1). Tune here — no code changes needed.
 * Per-mission values (par time, caps, maxScore) live in `progress/config/missions.catalog.ts`.
 *
 * Score = clamp( round( (kills + bosses + perfectBlocks + dodges + noHitRounds + time + health + lives)
 *                       × difficultyMultiplier ) + firstClearBonus, 0, mission.maxScore )
 * Rank is computed from the performance score (without the first-clear bonus) as a fraction of maxScore.
 */
export const SCORING_CONFIG = {
  /** Points per kill, by enemy type. Commanders and bosses are worth more. */
  killWeights: {
    infantry: 20,
    spearman: 25,
    archer: 25,
    cavalry: 40,
    bandit: 20,
    viking: 30,
    'balkan-soldier': 25,
    wolf: 15,
    boar: 15,
    ghost: 25,
    zombie: 15,
    servant: 10,
    commander: 300,
    boss: 0, // bosses are scored through `bossesDefeated` (below), never twice
  } satisfies Record<EnemyType, number>,

  /** Points per boss / duel opponent defeated (`bossesDefeated`). */
  bossDefeatPoints: 1000,

  perfectBlock: { points: 15, maxCounted: 40 },
  dodge: { points: 5, maxCounted: 60 },
  noHitRound: { points: 250 },

  /** Full bonus at or under par time, linearly decreasing to 0 at `zeroAtParMultiple × par`. */
  time: { maxBonus: 1500, zeroAtParMultiple: 2.5 },

  /** `healthRemainingPct` (0..1) × maxBonus. */
  health: { maxBonus: 500 },

  lives: { pointsPerLife: 200, maxCounted: 3 },

  difficultyMultiplier: {
    squire: 0.75,
    knight: 1.0,
    champion: 1.5,
  } satisfies Record<DifficultyId, number>,

  /** Added once, the first time a mission is completed (not multiplied, not part of the rank). */
  firstClearBonus: 500,

  /** Minimum fraction of mission.maxScore for each rank; anything below C is D. */
  rankThresholds: { S: 0.85, A: 0.7, B: 0.5, C: 0.3 },

  /** Server-side plausibility limits (spec §17.4). */
  plausibility: {
    maxDurationMs: 3 * 60 * 60 * 1000,
    /** Claimed duration may exceed server-measured elapsed time by at most this much (clock/latency slack). */
    serverElapsedSlackMs: 10_000,
    maxPerfectBlocksPerMinute: 40,
    maxDodgesPerMinute: 60,
    /** Lower bound used for the per-minute caps on very short runs. */
    minRateAllowance: 5,
    maxLives: 9,
    maxDamageTaken: 100_000,
  },
} as const;

export type ScoringConfig = typeof SCORING_CONFIG;
