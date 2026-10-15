import { LEVEL_CURVE_CONFIG } from '../config/level-curve.config';
import {
  levelForXp,
  levelInfo,
  titleForLevel,
  xpThresholdForLevel,
} from './level-curve.utils';

describe('level curve', () => {
  it('uses round(500 * (L-1)^1.6) cumulative thresholds', () => {
    expect(xpThresholdForLevel(1)).toBe(0);
    expect(xpThresholdForLevel(2)).toBe(500);
    expect(xpThresholdForLevel(3)).toBe(1516);
    expect(xpThresholdForLevel(10)).toBe(16817);
    expect(xpThresholdForLevel(50)).toBe(253095);
  });

  it('thresholds are strictly increasing up to max level', () => {
    for (let level = 2; level <= LEVEL_CURVE_CONFIG.maxLevel; level++) {
      expect(xpThresholdForLevel(level)).toBeGreaterThan(
        xpThresholdForLevel(level - 1),
      );
    }
  });

  it('maps XP to level at the boundaries', () => {
    expect(levelForXp(0)).toBe(1);
    expect(levelForXp(499)).toBe(1);
    expect(levelForXp(500)).toBe(2);
    expect(levelForXp(1515)).toBe(2);
    expect(levelForXp(1516)).toBe(3);
    expect(levelForXp(-50)).toBe(1);
    expect(levelForXp(10_000_000)).toBe(50);
  });

  it('exposes xpIntoLevel / xpForNextLevel', () => {
    expect(levelInfo(700)).toEqual({
      level: 2,
      xp: 700,
      xpIntoLevel: 200,
      xpForNextLevel: 1016,
      title: 'Squire',
    });
    expect(levelInfo(0)).toMatchObject({
      level: 1,
      xpIntoLevel: 0,
      xpForNextLevel: 500,
    });
  });

  it('reports 0/0 progress at max level', () => {
    expect(levelInfo(999_999)).toMatchObject({
      level: 50,
      xpIntoLevel: 0,
      xpForNextLevel: 0,
      title: 'Legend',
    });
  });

  it('assigns titles per level band', () => {
    expect(titleForLevel(1)).toBe('Squire');
    expect(titleForLevel(4)).toBe('Squire');
    expect(titleForLevel(5)).toBe('Man-at-Arms');
    expect(titleForLevel(10)).toBe('Knight');
    expect(titleForLevel(18)).toBe('Knight Banneret');
    expect(titleForLevel(26)).toBe('Paladin');
    expect(titleForLevel(34)).toBe('Champion');
    expect(titleForLevel(44)).toBe('Legend');
  });
});
