export interface LeaderboardMeEntry {
  rank: number;
  username: string;
  level: number;
  points: number;
  bestTimeMs: number | null;
}

export interface LeaderboardEntry extends LeaderboardMeEntry {
  isCurrentUser: boolean;
}

export interface LeaderboardResponse {
  data: LeaderboardEntry[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  me: LeaderboardMeEntry | null;
}

/** Internal ranked row (cached). `userId` never leaves the server. */
export interface RankedRow {
  userId: string;
  username: string;
  level: number;
  points: number;
  bestTimeMs: number | null;
}

export interface AggregateRow {
  userId: string;
  points: number;
  bestTimeMs: number | null;
}
