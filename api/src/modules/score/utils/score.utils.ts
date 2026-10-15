import {
  ENEMY_TYPES,
  EnemyType,
  MissionRankId,
} from '@/shared/constants/game.constants';
import type { MissionCatalogEntry } from '@/modules/progress/config/missions.catalog';
import { SCORING_CONFIG, ScoringConfig } from '../config/scoring.config';
import {
  MissionResultInput,
  ScoreBreakdownItem,
  ScoreResult,
} from '../interfaces/score.interface';

const ENEMY_LABELS: Record<EnemyType, string> = {
  infantry: 'Infantry',
  spearman: 'Spearmen',
  archer: 'Archers',
  cavalry: 'Cavalry',
  bandit: 'Bandits',
  viking: 'Vikings',
  'balkan-soldier': 'Balkan soldiers',
  wolf: 'Wolves',
  boar: 'Boars',
  ghost: 'Ghosts',
  zombie: 'Zombies',
  servant: 'Servants',
  commander: 'Commanders',
  boss: 'Bosses',
};

const isNonNegativeInt = (value: unknown): value is number =>
  typeof value === 'number' && Number.isInteger(value) && value >= 0;

/**
 * Plausibility checks for a submitted run (spec §17.4). Returns the list of violations (empty = plausible).
 * Token validity / ownership / replay are checked by the caller.
 */
export function checkPlausibility(
  mission: MissionCatalogEntry,
  result: MissionResultInput,
  serverElapsedMs: number,
  config: ScoringConfig = SCORING_CONFIG,
): string[] {
  const p = config.plausibility;
  const violations: string[] = [];

  if (!isNonNegativeInt(result.durationMs))
    violations.push('durationMs must be a non-negative integer');
  if (result.durationMs > p.maxDurationMs)
    violations.push(`durationMs exceeds ${p.maxDurationMs}`);
  if (result.durationMs > serverElapsedMs + p.serverElapsedSlackMs) {
    violations.push(
      `durationMs ${result.durationMs} exceeds server-measured elapsed ${serverElapsedMs}ms (+slack)`,
    );
  }

  // Defeats only need the timing to be sane; nothing is scored.
  if (result.outcome === 'defeat') return violations;

  if (result.durationMs < mission.minDurationMs) {
    violations.push(
      `durationMs ${result.durationMs} below minimum ${mission.minDurationMs} for ${mission.id}`,
    );
  }

  for (const [type, count] of Object.entries(result.kills ?? {})) {
    if (!(ENEMY_TYPES as readonly string[]).includes(type)) {
      violations.push(`unknown enemy type ${type}`);
      continue;
    }
    if (!isNonNegativeInt(count)) {
      violations.push(`kills.${type} must be a non-negative integer`);
      continue;
    }
    const cap = mission.maxKillsPerType[type as EnemyType] ?? 0;
    if (type !== 'boss' && count > cap)
      violations.push(`kills.${type}=${count} exceeds cap ${cap}`);
    if (type === 'boss' && count > mission.bossCount)
      violations.push(`kills.boss=${count} exceeds ${mission.bossCount}`);
  }

  if (
    !isNonNegativeInt(result.bossesDefeated) ||
    result.bossesDefeated > mission.bossCount
  ) {
    violations.push(
      `bossesDefeated=${result.bossesDefeated} exceeds ${mission.bossCount}`,
    );
  }
  if (
    !isNonNegativeInt(result.noHitRounds) ||
    result.noHitRounds > mission.maxNoHitRounds
  ) {
    violations.push(
      `noHitRounds=${result.noHitRounds} exceeds ${mission.maxNoHitRounds}`,
    );
  }

  const minutes = result.durationMs / 60_000;
  const maxBlocks = Math.max(
    p.minRateAllowance,
    Math.ceil(minutes * p.maxPerfectBlocksPerMinute),
  );
  const maxDodges = Math.max(
    p.minRateAllowance,
    Math.ceil(minutes * p.maxDodgesPerMinute),
  );
  if (
    !isNonNegativeInt(result.perfectBlocks) ||
    result.perfectBlocks > maxBlocks
  ) {
    violations.push(
      `perfectBlocks=${result.perfectBlocks} exceeds ${maxBlocks} for duration`,
    );
  }
  if (!isNonNegativeInt(result.dodges) || result.dodges > maxDodges) {
    violations.push(
      `dodges=${result.dodges} exceeds ${maxDodges} for duration`,
    );
  }

  if (
    !isNonNegativeInt(result.livesRemaining) ||
    result.livesRemaining > p.maxLives
  ) {
    violations.push(`livesRemaining=${result.livesRemaining} out of range`);
  }
  if (!(result.healthRemainingPct >= 0 && result.healthRemainingPct <= 1)) {
    violations.push('healthRemainingPct must be within 0..1');
  }
  if (!(result.damageTaken >= 0 && result.damageTaken <= p.maxDamageTaken)) {
    violations.push('damageTaken out of range');
  }
  if (result.healthRemainingPct <= 0)
    violations.push('victory with no health remaining');

  return violations;
}

/** Time bonus: full at or under par, linear down to 0 at `zeroAtParMultiple × par`. */
export function timeBonus(
  durationMs: number,
  parTimeMs: number,
  config: ScoringConfig = SCORING_CONFIG,
): number {
  const { maxBonus, zeroAtParMultiple } = config.time;
  if (durationMs <= parTimeMs) return maxBonus;
  const zeroAt = parTimeMs * zeroAtParMultiple;
  if (durationMs >= zeroAt) return 0;
  return Math.round(maxBonus * ((zeroAt - durationMs) / (zeroAt - parTimeMs)));
}

export function rankForScore(
  score: number,
  maxScore: number,
  config: ScoringConfig = SCORING_CONFIG,
): MissionRankId {
  const fraction = maxScore > 0 ? score / maxScore : 0;
  const t = config.rankThresholds;
  if (fraction >= t.S) return 'S';
  if (fraction >= t.A) return 'A';
  if (fraction >= t.B) return 'B';
  if (fraction >= t.C) return 'C';
  return 'D';
}

/** Server-authoritative score for a (plausible) victory. All weights come from SCORING_CONFIG. */
export function computeScore(
  mission: MissionCatalogEntry,
  result: MissionResultInput,
  options: { firstClear: boolean },
  config: ScoringConfig = SCORING_CONFIG,
): ScoreResult {
  const items: ScoreBreakdownItem[] = [];
  const add = (key: string, label: string, points: number) => {
    if (points !== 0) items.push({ key, label, points: Math.round(points) });
  };

  for (const type of ENEMY_TYPES) {
    if (type === 'boss') continue;
    const cap = mission.maxKillsPerType[type] ?? 0;
    const count = Math.min(result.kills?.[type] ?? 0, cap);
    add(
      `kills.${type}`,
      `${ENEMY_LABELS[type]} slain ×${count}`,
      count * config.killWeights[type],
    );
  }

  const bosses = Math.min(result.bossesDefeated, mission.bossCount);
  add('bosses', `Bosses defeated ×${bosses}`, bosses * config.bossDefeatPoints);

  const blocks = Math.min(result.perfectBlocks, config.perfectBlock.maxCounted);
  add(
    'perfectBlocks',
    `Perfect blocks ×${blocks}`,
    blocks * config.perfectBlock.points,
  );

  const dodges = Math.min(result.dodges, config.dodge.maxCounted);
  add('dodges', `Dodges ×${dodges}`, dodges * config.dodge.points);

  const noHit = Math.min(result.noHitRounds, mission.maxNoHitRounds);
  add(
    'noHitRounds',
    `Flawless rounds ×${noHit}`,
    noHit * config.noHitRound.points,
  );

  add(
    'time',
    'Time bonus',
    timeBonus(result.durationMs, mission.parTimeMs, config),
  );
  add(
    'health',
    'Health remaining',
    Math.min(1, Math.max(0, result.healthRemainingPct)) *
      config.health.maxBonus,
  );

  const lives = Math.min(result.livesRemaining, config.lives.maxCounted);
  add('lives', `Lives remaining ×${lives}`, lives * config.lives.pointsPerLife);

  const base = items.reduce((sum, item) => sum + item.points, 0);
  const multiplier = config.difficultyMultiplier[result.difficulty];
  const multiplied = Math.round(base * multiplier);
  add(
    'difficulty',
    `Difficulty (${result.difficulty} ×${multiplier})`,
    multiplied - base,
  );

  const performanceScore = Math.min(multiplied, mission.maxScore);
  if (options.firstClear)
    add('firstClear', 'First clear bonus', config.firstClearBonus);

  const uncapped = items.reduce((sum, item) => sum + item.points, 0);
  const score = Math.max(0, Math.min(uncapped, mission.maxScore));
  add('cap', 'Mission score cap', score - uncapped);

  return {
    score,
    performanceScore,
    rank: rankForScore(performanceScore, mission.maxScore, config),
    breakdown: items,
  };
}
