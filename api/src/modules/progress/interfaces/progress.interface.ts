import {
  CharacterId,
  MissionId,
  MissionRankId,
} from '@/shared/constants/game.constants';
import { ProfileView } from '@/modules/profile/interfaces/profile.interface';
import { ScoreBreakdownItem } from '@/modules/score/interfaces/score.interface';

export type MissionStatusId =
  | 'locked'
  | 'unlocked'
  | 'in_progress'
  | 'completed';

export interface MissionSummary {
  missionId: MissionId;
  status: MissionStatusId;
  bestScore: number;
  bestTimeMs: number | null;
  completions: number;
  bestRank: MissionRankId | null;
}

export interface ProgressResponse {
  saveVersion: number;
  currentMissionId: MissionId;
  highestUnlockedMissionId: MissionId;
  trainingGroundsUnlocked: boolean;
  missions: MissionSummary[];
  unlockedCharacters: CharacterId[];
}

export interface MissionStartResponse {
  runId: string;
  runToken: string;
  startedAt: string;
}

export interface MissionCompleteResponse {
  accepted: boolean;
  score: number;
  rank: MissionRankId;
  breakdown: ScoreBreakdownItem[];
  xpGained: number;
  profile: ProfileView;
  levelUp: boolean;
  newlyUnlockedMissionId: MissionId | null;
  newlyUnlockedCharacters: CharacterId[];
  personalBest: boolean;
  progress: ProgressResponse;
}

export interface RunTokenPayload {
  sub: string;
  rid: string;
  mid: MissionId;
  typ: 'run';
}
