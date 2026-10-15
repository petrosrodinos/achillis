import {
  AggregateRow,
  LeaderboardResponse,
  RankedRow,
} from '../interfaces/leaderboard.interface';

const DAY_MS = 24 * 60 * 60 * 1000;

export type LeaderboardWindow = 'all' | 'monthly' | 'weekly';
export type LeaderboardSort = 'points' | 'time';

/** Start of the rolling window (weekly = last 7 days, monthly = last 30 days); null for all-time. */
export function windowStart(
  window: LeaderboardWindow,
  now: Date = new Date(),
): Date | null {
  if (window === 'weekly') return new Date(now.getTime() - 7 * DAY_MS);
  if (window === 'monthly') return new Date(now.getTime() - 30 * DAY_MS);
  return null;
}

/** Sum of the best score per mission for each user (global windowed leaderboard). */
export function sumBestPerMission(
  rows: { user_id: string; _max: { score: number | null } }[],
): AggregateRow[] {
  const totals = new Map<string, number>();
  for (const row of rows)
    totals.set(
      row.user_id,
      (totals.get(row.user_id) ?? 0) + (row._max.score ?? 0),
    );
  return Array.from(totals, ([userId, points]) => ({
    userId,
    points,
    bestTimeMs: null,
  }));
}

const timeOrInf = (value: number | null) =>
  value === null ? Number.POSITIVE_INFINITY : value;

export function sortRanked(
  rows: RankedRow[],
  sort: LeaderboardSort,
): RankedRow[] {
  return [...rows].sort((a, b) => {
    if (sort === 'time') {
      return (
        timeOrInf(a.bestTimeMs) - timeOrInf(b.bestTimeMs) ||
        b.points - a.points ||
        a.username.localeCompare(b.username)
      );
    }
    return (
      b.points - a.points ||
      timeOrInf(a.bestTimeMs) - timeOrInf(b.bestTimeMs) ||
      a.username.localeCompare(b.username)
    );
  });
}

/** Builds the paginated public response from a fully ranked list. */
export function paginateRanked(
  ranked: RankedRow[],
  page: number,
  limit: number,
  viewerId: string | null,
): LeaderboardResponse {
  const total = ranked.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;

  const data = ranked.slice(start, start + limit).map((row, index) => ({
    rank: start + index + 1,
    username: row.username,
    level: row.level,
    points: row.points,
    bestTimeMs: row.bestTimeMs,
    isCurrentUser: viewerId !== null && row.userId === viewerId,
  }));

  return {
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
    me: findMe(ranked, viewerId),
  };
}

export function findMe(ranked: RankedRow[], viewerId: string | null) {
  if (!viewerId) return null;
  const index = ranked.findIndex((row) => row.userId === viewerId);
  if (index === -1) return null;
  const row = ranked[index];
  return {
    rank: index + 1,
    username: row.username,
    level: row.level,
    points: row.points,
    bestTimeMs: row.bestTimeMs,
  };
}
