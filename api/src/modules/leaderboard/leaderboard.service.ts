import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { CacheService } from '@/shared/services/cache/cache.service';
import { LeaderboardQueryType } from './dto/leaderboard-query.schema';
import {
  AggregateRow,
  LeaderboardMeEntry,
  LeaderboardResponse,
  RankedRow,
} from './interfaces/leaderboard.interface';
import {
  findMe,
  paginateRanked,
  sortRanked,
  sumBestPerMission,
  windowStart,
} from './utils/leaderboard.utils';

export const LEADERBOARD_CACHE_TTL_MS = 30_000;
const VERSION_KEY = 'lb:version';
const VERSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;

@Injectable()
export class LeaderboardService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cache: CacheService,
  ) {}

  async getLeaderboard(
    query: LeaderboardQueryType,
    viewerId: string | null,
  ): Promise<LeaderboardResponse> {
    const ranked = await this.getRanked(query);
    return paginateRanked(ranked, query.page, query.limit, viewerId);
  }

  async getMyEntry(
    query: LeaderboardQueryType,
    userId: string,
  ): Promise<LeaderboardMeEntry | null> {
    return findMe(await this.getRanked(query), userId);
  }

  /** Called after every accepted score; bumps the cache version so all cached boards are discarded. */
  async invalidate(): Promise<void> {
    await this.cache.set(VERSION_KEY, Date.now(), VERSION_TTL_MS);
  }

  /** Full ranking for a (scope, mission, window, sort) query, cached for 30 s. */
  private async getRanked(query: LeaderboardQueryType): Promise<RankedRow[]> {
    const version = (await this.cache.get<number>(VERSION_KEY)) ?? 0;
    const key = `lb:${version}:${query.scope}:${query.missionId ?? '-'}:${query.window}:${query.sort}`;
    const cached = await this.cache.get<RankedRow[]>(key);
    if (cached) return cached;

    const aggregates = await this.aggregate(query);
    const ranked = sortRanked(await this.hydrate(aggregates), query.sort);
    await this.cache.set(key, ranked, LEADERBOARD_CACHE_TTL_MS);
    return ranked;
  }

  private async aggregate(
    query: LeaderboardQueryType,
  ): Promise<AggregateRow[]> {
    const since = windowStart(query.window);

    if (query.scope === 'global') {
      if (!since) {
        const profiles = await this.prisma.profile.findMany({
          where: { total_points: { gt: 0 } },
          select: { user_id: true, total_points: true },
        });
        return profiles.map((p) => ({
          userId: p.user_id,
          points: p.total_points,
          bestTimeMs: null,
        }));
      }
      const groups = await this.prisma.scoreEntry.groupBy({
        by: ['user_id', 'mission_id'],
        where: { created_at: { gte: since } },
        _max: { score: true },
      });
      return sumBestPerMission(groups);
    }

    // Per-mission boards only include victories (ScoreEntry rows / completed missions).
    if (!since) {
      const rows = await this.prisma.missionProgress.findMany({
        where: { mission_id: query.missionId, completions: { gt: 0 } },
        select: { user_id: true, best_score: true, best_time_ms: true },
      });
      return rows.map((r) => ({
        userId: r.user_id,
        points: r.best_score,
        bestTimeMs: r.best_time_ms,
      }));
    }
    const groups = await this.prisma.scoreEntry.groupBy({
      by: ['user_id'],
      where: { mission_id: query.missionId, created_at: { gte: since } },
      _max: { score: true },
      _min: { duration_ms: true },
    });
    return groups.map((g) => ({
      userId: g.user_id,
      points: g._max.score ?? 0,
      bestTimeMs: g._min.duration_ms,
    }));
  }

  private async hydrate(rows: AggregateRow[]): Promise<RankedRow[]> {
    if (rows.length === 0) return [];
    const users = await this.prisma.user.findMany({
      where: { id: { in: rows.map((r) => r.userId) } },
      select: {
        id: true,
        username: true,
        profile: { select: { level: true } },
      },
    });
    const byId = new Map(users.map((u) => [u.id, u]));
    return rows
      .filter((row) => byId.has(row.userId))
      .map((row) => {
        const user = byId.get(row.userId)!;
        return {
          ...row,
          username: user.username,
          level: user.profile?.level ?? 1,
        };
      });
  }
}
