import { ApiProperty } from '@nestjs/swagger';
import {
  CHARACTER_IDS,
  CharacterId,
  MISSION_IDS,
  MISSION_RANKS,
  MissionId,
  MissionRankId,
} from '@/shared/constants/game.constants';
import { ProfileEntity } from '@/modules/profile/entities/me.entity';
import {
  MissionCompleteResponse,
  MissionStartResponse,
  MissionStatusId,
  MissionSummary,
  ProgressResponse,
} from '../interfaces/progress.interface';

export class MissionSummaryEntity implements MissionSummary {
  @ApiProperty({ enum: MISSION_IDS }) missionId: MissionId;
  @ApiProperty({ enum: ['locked', 'unlocked', 'in_progress', 'completed'] })
  status: MissionStatusId;
  @ApiProperty() bestScore: number;
  @ApiProperty({ nullable: true, type: Number }) bestTimeMs: number | null;
  @ApiProperty() completions: number;
  @ApiProperty({ enum: MISSION_RANKS, nullable: true })
  bestRank: MissionRankId | null;
}

export class ProgressEntity implements ProgressResponse {
  @ApiProperty({ example: 1 }) saveVersion: number;
  @ApiProperty({ enum: MISSION_IDS }) currentMissionId: MissionId;
  @ApiProperty({ enum: MISSION_IDS }) highestUnlockedMissionId: MissionId;
  @ApiProperty() trainingGroundsUnlocked: boolean;
  @ApiProperty({ type: [MissionSummaryEntity] })
  missions: MissionSummaryEntity[];
  @ApiProperty({ enum: CHARACTER_IDS, isArray: true })
  unlockedCharacters: CharacterId[];
}

export class MissionStartEntity implements MissionStartResponse {
  @ApiProperty() runId: string;
  @ApiProperty() runToken: string;
  @ApiProperty() startedAt: string;
}

export class ScoreBreakdownItemEntity {
  @ApiProperty({ example: 'kills.infantry' }) key: string;
  @ApiProperty({ example: 'Infantry slain ×12' }) label: string;
  @ApiProperty({ example: 240 }) points: number;
}

export class MissionCompleteEntity implements MissionCompleteResponse {
  @ApiProperty() accepted: boolean;
  @ApiProperty() score: number;
  @ApiProperty({ enum: MISSION_RANKS }) rank: MissionRankId;
  @ApiProperty({ type: [ScoreBreakdownItemEntity] })
  breakdown: ScoreBreakdownItemEntity[];
  @ApiProperty() xpGained: number;
  @ApiProperty({ type: ProfileEntity }) profile: ProfileEntity;
  @ApiProperty() levelUp: boolean;
  @ApiProperty({ enum: MISSION_IDS, nullable: true })
  newlyUnlockedMissionId: MissionId | null;
  @ApiProperty({ enum: CHARACTER_IDS, isArray: true })
  newlyUnlockedCharacters: CharacterId[];
  @ApiProperty() personalBest: boolean;
  @ApiProperty({ type: ProgressEntity }) progress: ProgressEntity;
}
