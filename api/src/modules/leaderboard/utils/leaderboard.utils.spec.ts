import { RankedRow } from '../interfaces/leaderboard.interface';
import {
  paginateRanked,
  sortRanked,
  sumBestPerMission,
  windowStart,
} from './leaderboard.utils';

const r = (
  userId: string,
  points: number,
  bestTimeMs: number | null = null,
): RankedRow => ({
  userId,
  username: userId.toUpperCase(),
  level: 1,
  points,
  bestTimeMs,
});

describe('leaderboard utils', () => {
  it('computes rolling windows', () => {
    const now = new Date('2026-10-15T00:00:00Z');
    expect(windowStart('all', now)).toBeNull();
    expect(windowStart('weekly', now)?.toISOString()).toBe(
      '2026-10-08T00:00:00.000Z',
    );
    expect(windowStart('monthly', now)?.toISOString()).toBe(
      '2026-09-15T00:00:00.000Z',
    );
  });

  it('sums best score per mission per user', () => {
    const totals = sumBestPerMission([
      { user_id: 'a', _max: { score: 100 } },
      { user_id: 'a', _max: { score: 50 } },
      { user_id: 'b', _max: { score: 120 } },
    ]);
    expect(totals).toEqual([
      { userId: 'a', points: 150, bestTimeMs: null },
      { userId: 'b', points: 120, bestTimeMs: null },
    ]);
  });

  it('sorts by points or time', () => {
    const rows = [r('a', 100, 5000), r('b', 300, 9000), r('c', 300, 4000)];
    expect(sortRanked(rows, 'points').map((x) => x.userId)).toEqual([
      'c',
      'b',
      'a',
    ]);
    expect(sortRanked(rows, 'time').map((x) => x.userId)).toEqual([
      'c',
      'a',
      'b',
    ]);
  });

  it('paginates, highlights the viewer and returns their rank outside the page', () => {
    const ranked = Array.from({ length: 25 }, (_, i) => r(`u${i}`, 1000 - i));
    const page1 = paginateRanked(ranked, 1, 10, 'u22');
    expect(page1.data).toHaveLength(10);
    expect(page1.data[0]).toEqual({
      rank: 1,
      username: 'U0',
      level: 1,
      points: 1000,
      bestTimeMs: null,
      isCurrentUser: false,
    });
    expect(page1.pagination).toEqual({
      total: 25,
      page: 1,
      limit: 10,
      totalPages: 3,
      hasNext: true,
      hasPrev: false,
    });
    expect(page1.me).toEqual({
      rank: 23,
      username: 'U22',
      level: 1,
      points: 978,
      bestTimeMs: null,
    });

    const page3 = paginateRanked(ranked, 3, 10, 'u22');
    expect(page3.data.find((d) => d.isCurrentUser)?.rank).toBe(23);
    expect(page3.pagination.hasNext).toBe(false);
    expect(paginateRanked(ranked, 1, 10, null).me).toBeNull();
    expect(JSON.stringify(page1)).not.toContain('userId');
  });
});
