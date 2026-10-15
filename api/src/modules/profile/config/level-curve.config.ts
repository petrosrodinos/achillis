/**
 * XP & level curve (spec §17.2, task P4-05).
 *
 * - XP gained per accepted mission run = points scored by that run (replays also grant XP).
 * - Cumulative XP needed to REACH level L (L >= 2) is `round(BASE * (L - 1) ^ EXPONENT)`;
 *   level 1 starts at 0 XP. So level 2 needs 500 XP, level 3 needs 1 516 XP, level 10 needs
 *   16 817 XP and level 50 (max) needs 253 095 XP in total.
 * - `xpIntoLevel` = XP earned since reaching the current level,
 *   `xpForNextLevel` = XP span of the current level (threshold(L+1) - threshold(L)); both are 0 at max level.
 */
export const LEVEL_CURVE_CONFIG = {
  base: 500,
  exponent: 1.6,
  maxLevel: 50,
  /** Titles by minimum level (ascending). */
  titles: [
    { minLevel: 1, title: 'Squire' },
    { minLevel: 5, title: 'Man-at-Arms' },
    { minLevel: 10, title: 'Knight' },
    { minLevel: 18, title: 'Knight Banneret' },
    { minLevel: 26, title: 'Paladin' },
    { minLevel: 34, title: 'Champion' },
    { minLevel: 44, title: 'Legend' },
  ],
} as const;

export type LevelCurveConfig = typeof LEVEL_CURVE_CONFIG;
