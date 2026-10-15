import {
  LEVEL_CURVE_CONFIG,
  LevelCurveConfig,
} from '../config/level-curve.config';

export interface LevelInfo {
  level: number;
  xp: number;
  xpIntoLevel: number;
  xpForNextLevel: number;
  title: string;
}

/** Cumulative XP required to reach `level`. */
export function xpThresholdForLevel(
  level: number,
  config: LevelCurveConfig = LEVEL_CURVE_CONFIG,
): number {
  if (level <= 1) return 0;
  const capped = Math.min(level, config.maxLevel);
  return Math.round(config.base * Math.pow(capped - 1, config.exponent));
}

export function levelForXp(
  xp: number,
  config: LevelCurveConfig = LEVEL_CURVE_CONFIG,
): number {
  const safeXp = Math.max(0, Math.floor(xp));
  let level = 1;
  while (
    level < config.maxLevel &&
    safeXp >= xpThresholdForLevel(level + 1, config)
  )
    level++;
  return level;
}

export function titleForLevel(
  level: number,
  config: LevelCurveConfig = LEVEL_CURVE_CONFIG,
): string {
  let title: string = config.titles[0].title;
  for (const band of config.titles) {
    if (level >= band.minLevel) title = band.title;
  }
  return title;
}

export function levelInfo(
  xp: number,
  config: LevelCurveConfig = LEVEL_CURVE_CONFIG,
): LevelInfo {
  const safeXp = Math.max(0, Math.floor(xp));
  const level = levelForXp(safeXp, config);
  const atMax = level >= config.maxLevel;
  const current = xpThresholdForLevel(level, config);
  return {
    level,
    xp: safeXp,
    xpIntoLevel: atMax ? 0 : safeXp - current,
    xpForNextLevel: atMax
      ? 0
      : xpThresholdForLevel(level + 1, config) - current,
    title: titleForLevel(level, config),
  };
}
