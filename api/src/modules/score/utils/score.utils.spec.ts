import { MISSIONS_CATALOG } from '@/modules/progress/config/missions.catalog';
import { SCORING_CONFIG } from '../config/scoring.config';
import { MissionResultInput } from '../interfaces/score.interface';
import {
  checkPlausibility,
  computeScore,
  rankForScore,
  timeBonus,
} from './score.utils';

const m02 = MISSIONS_CATALOG.m02;
const m01 = MISSIONS_CATALOG.m01;

const duelVictory = (
  overrides: Partial<MissionResultInput> = {},
): MissionResultInput => ({
  outcome: 'victory',
  durationMs: 100_000,
  kills: { commander: 1 },
  bossesDefeated: 1,
  damageTaken: 30,
  perfectBlocks: 10,
  dodges: 20,
  noHitRounds: 1,
  healthRemainingPct: 0.5,
  livesRemaining: 2,
  difficulty: 'knight',
  ...overrides,
});

const sum = (items: { points: number }[]) =>
  items.reduce((acc, item) => acc + item.points, 0);

describe('computeScore', () => {
  it('applies every weight from the scoring config', () => {
    // 300 commander + 1000 boss + 150 blocks + 100 dodges + 250 no-hit + 1500 time + 250 health + 400 lives
    const result = computeScore(m02, duelVictory(), { firstClear: false });
    expect(result.score).toBe(3950);
    expect(result.performanceScore).toBe(3950);
    expect(result.rank).toBe('S');
    expect(sum(result.breakdown)).toBe(result.score);
    expect(
      result.breakdown.find((b) => b.key === 'kills.commander')?.points,
    ).toBe(300);
    expect(result.breakdown.find((b) => b.key === 'bosses')?.points).toBe(1000);
  });

  it('applies difficulty multipliers (squire 0.6, champion 1.5) and clamps to maxScore', () => {
    const squire = computeScore(m02, duelVictory({ difficulty: 'squire' }), {
      firstClear: false,
    });
    expect(squire.score).toBe(2370);
    expect(squire.rank).toBe('B');

    const champion = computeScore(
      m02,
      duelVictory({ difficulty: 'champion' }),
      { firstClear: false },
    );
    expect(champion.score).toBe(m02.maxScore);
    expect(sum(champion.breakdown)).toBe(m02.maxScore);
    expect(
      champion.breakdown.find((b) => b.key === 'cap')?.points,
    ).toBeLessThan(0);
  });

  it('adds the first-clear bonus without affecting the rank', () => {
    const base = computeScore(m02, duelVictory({ difficulty: 'squire' }), {
      firstClear: false,
    });
    const first = computeScore(m02, duelVictory({ difficulty: 'squire' }), {
      firstClear: true,
    });
    expect(first.score).toBe(base.score + SCORING_CONFIG.firstClearBonus);
    expect(first.rank).toBe(base.rank);
  });

  it('caps counted perfect blocks / dodges / kills', () => {
    const result = computeScore(
      m01,
      {
        ...duelVictory(),
        kills: { infantry: 5000 },
        bossesDefeated: 0,
        perfectBlocks: 999,
        dodges: 999,
        durationMs: 3_600_000,
      },
      { firstClear: false },
    );
    expect(
      result.breakdown.find((b) => b.key === 'kills.infantry')?.points,
    ).toBe(200 * 20);
    expect(
      result.breakdown.find((b) => b.key === 'perfectBlocks')?.points,
    ).toBe(40 * 15);
    expect(result.breakdown.find((b) => b.key === 'dodges')?.points).toBe(
      60 * 5,
    );
  });

  it('never double-counts kills.boss', () => {
    const withBossKill = computeScore(
      m02,
      duelVictory({ kills: { commander: 1, boss: 1 } }),
      { firstClear: false },
    );
    expect(withBossKill.score).toBe(3950);
  });
});

describe('timeBonus', () => {
  it('is full at par, linear to zero at 2.5× par', () => {
    expect(timeBonus(50_000, 100_000)).toBe(1500);
    expect(timeBonus(100_000, 100_000)).toBe(1500);
    expect(timeBonus(175_000, 100_000)).toBe(750);
    expect(timeBonus(250_000, 100_000)).toBe(0);
    expect(timeBonus(900_000, 100_000)).toBe(0);
  });
});

describe('rankForScore', () => {
  it('uses fractions of maxScore', () => {
    expect(rankForScore(850, 1000)).toBe('S');
    expect(rankForScore(849, 1000)).toBe('A');
    expect(rankForScore(700, 1000)).toBe('A');
    expect(rankForScore(500, 1000)).toBe('B');
    expect(rankForScore(300, 1000)).toBe('C');
    expect(rankForScore(299, 1000)).toBe('D');
  });
});

describe('checkPlausibility', () => {
  const elapsed = 120_000;

  it('accepts a plausible run', () => {
    expect(checkPlausibility(m02, duelVictory(), elapsed)).toEqual([]);
  });

  it('rejects victories faster than the mission minimum', () => {
    expect(
      checkPlausibility(
        m02,
        duelVictory({ durationMs: 5_000 }),
        elapsed,
      ).join(),
    ).toContain('below minimum');
  });

  it('rejects durations longer than the server-measured elapsed time (+10 s slack)', () => {
    expect(
      checkPlausibility(m02, duelVictory({ durationMs: 100_000 }), 95_000),
    ).toEqual([]);
    expect(
      checkPlausibility(
        m02,
        duelVictory({ durationMs: 100_000 }),
        80_000,
      ).join(),
    ).toContain('server-measured');
  });

  it('rejects durations above 3 h', () => {
    const v = checkPlausibility(
      m02,
      duelVictory({ durationMs: 3 * 3600_000 + 1 }),
      4 * 3600_000,
    );
    expect(v.join()).toContain('exceeds 10800000');
  });

  it('rejects kills above caps and kills of types not in the mission', () => {
    expect(
      checkPlausibility(
        m02,
        duelVictory({ kills: { commander: 2 } }),
        elapsed,
      ).join(),
    ).toContain('exceeds cap');
    expect(
      checkPlausibility(
        m02,
        duelVictory({ kills: { wolf: 1 } }),
        elapsed,
      ).join(),
    ).toContain('kills.wolf');
  });

  it('rejects too many bosses, no-hit rounds and lives', () => {
    expect(
      checkPlausibility(
        m02,
        duelVictory({ bossesDefeated: 2 }),
        elapsed,
      ).join(),
    ).toContain('bossesDefeated');
    expect(
      checkPlausibility(m02, duelVictory({ noHitRounds: 3 }), elapsed).join(),
    ).toContain('noHitRounds');
    expect(
      checkPlausibility(
        m02,
        duelVictory({ livesRemaining: 99 }),
        elapsed,
      ).join(),
    ).toContain('livesRemaining');
  });

  it('rejects negative / out-of-range values', () => {
    expect(
      checkPlausibility(m02, duelVictory({ dodges: -1 }), elapsed).length,
    ).toBeGreaterThan(0);
    expect(
      checkPlausibility(m02, duelVictory({ kills: { commander: -1 } }), elapsed)
        .length,
    ).toBeGreaterThan(0);
    expect(
      checkPlausibility(m02, duelVictory({ healthRemainingPct: 1.5 }), elapsed)
        .length,
    ).toBeGreaterThan(0);
    expect(
      checkPlausibility(m02, duelVictory({ damageTaken: -5 }), elapsed).length,
    ).toBeGreaterThan(0);
  });

  it('rejects impossible perfect-block / dodge rates', () => {
    expect(
      checkPlausibility(
        m02,
        duelVictory({ dodges: 500, durationMs: 60_000 }),
        elapsed,
      ).join(),
    ).toContain('dodges=');
    expect(
      checkPlausibility(
        m02,
        duelVictory({ perfectBlocks: 100, durationMs: 60_000 }),
        elapsed,
      ).join(),
    ).toContain('perfectBlocks=');
  });

  it('only checks timing sanity for defeats', () => {
    const defeat = duelVictory({
      outcome: 'defeat',
      durationMs: 3_000,
      healthRemainingPct: 0,
      kills: {},
    });
    expect(checkPlausibility(m02, defeat, elapsed)).toEqual([]);
    expect(
      checkPlausibility(m02, { ...defeat, durationMs: 999_999 }, elapsed)
        .length,
    ).toBe(1);
  });
});
