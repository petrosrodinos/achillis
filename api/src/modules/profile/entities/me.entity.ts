import { ApiProperty } from '@nestjs/swagger';
import {
  CHARACTER_IDS,
  CharacterId,
  DIFFICULTIES,
  DifficultyId,
} from '@/shared/constants/game.constants';
import { GameAction, GAME_ACTIONS } from '../config/settings.config';
import {
  GameSettings as GameSettingsShape,
  MeResponse,
  ProfileView,
} from '../interfaces/profile.interface';

export class ProfileEntity implements ProfileView {
  @ApiProperty({ example: 3 }) level: number;
  @ApiProperty({ example: 2100 }) xp: number;
  @ApiProperty({
    example: 1306,
    description: 'XP span of the current level (0 at max level)',
  })
  xpForNextLevel: number;
  @ApiProperty({
    example: 584,
    description: 'XP earned since reaching the current level',
  })
  xpIntoLevel: number;
  @ApiProperty({ example: 2100 }) totalPoints: number;
  @ApiProperty({ example: 'Squire' }) title: string;
}

export class GameSettingsEntity implements GameSettingsShape {
  @ApiProperty({ example: 0.8 }) masterVolume: number;
  @ApiProperty({ example: 0.6 }) musicVolume: number;
  @ApiProperty({ example: 0.8 }) sfxVolume: number;
  @ApiProperty() reducedMotion: boolean;
  @ApiProperty() screenShake: boolean;
  @ApiProperty() showFps: boolean;
  @ApiProperty({ enum: DIFFICULTIES }) difficulty: DifficultyId;
  @ApiProperty({
    type: 'object',
    additionalProperties: { type: 'array', items: { type: 'string' } },
    description: `Keys: ${GAME_ACTIONS.join(', ')}`,
  })
  keyBindings: Record<GameAction, string[]>;
}

export class MeEntity implements MeResponse {
  @ApiProperty() id: string;
  @ApiProperty() email: string;
  @ApiProperty() username: string;
  @ApiProperty() emailVerified: boolean;
  @ApiProperty() createdAt: string;
  @ApiProperty({ type: ProfileEntity }) profile: ProfileEntity;
  @ApiProperty({ type: GameSettingsEntity }) settings: GameSettingsEntity;
  @ApiProperty({ enum: CHARACTER_IDS, isArray: true })
  unlockedCharacters: CharacterId[];
}

export class UserEnvelopeEntity {
  @ApiProperty({ type: MeEntity }) user: MeEntity;
}
