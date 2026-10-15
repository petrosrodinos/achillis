import {
  CharacterId,
  DifficultyId,
  EnemyType,
  MissionRankId,
} from '@/shared/constants/game.constants';

/** Run summary submitted by the client (MissionResultDto without the token). */
export interface MissionResultInput {
  outcome: 'victory' | 'defeat';
  durationMs: number;
  kills: Partial<Record<EnemyType, number>>;
  bossesDefeated: number;
  damageTaken: number;
  perfectBlocks: number;
  dodges: number;
  noHitRounds: number;
  healthRemainingPct: number;
  livesRemaining: number;
  difficulty: DifficultyId;
  trainingCharacterId?: CharacterId;
}

export interface ScoreBreakdownItem {
  key: string;
  label: string;
  points: number;
}

export interface ScoreResult {
  /** Final score (sum of breakdown points), clamped to the mission maxScore. */
  score: number;
  /** Score without the first-clear bonus (used for the rank). */
  performanceScore: number;
  rank: MissionRankId;
  breakdown: ScoreBreakdownItem[];
}
