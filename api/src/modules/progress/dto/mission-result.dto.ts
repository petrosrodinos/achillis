import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsIn,
  IsInt,
  IsJWT,
  IsNumber,
  IsOptional,
  registerDecorator,
  ValidationArguments,
} from 'class-validator';
import {
  CHARACTER_IDS,
  CharacterId,
  DIFFICULTIES,
  DifficultyId,
  ENEMY_TYPES,
  EnemyType,
} from '@/shared/constants/game.constants';
import { MissionResultInput } from '@/modules/score/interfaces/score.interface';

function killsErrors(value: unknown): string[] {
  if (typeof value !== 'object' || value === null || Array.isArray(value))
    return ['kills must be an object'];
  const errors: string[] = [];
  for (const [type, count] of Object.entries(value)) {
    if (!(ENEMY_TYPES as readonly string[]).includes(type))
      errors.push(`kills: unknown enemy type "${type}"`);
    else if (typeof count !== 'number' || !Number.isInteger(count))
      errors.push(`kills.${type} must be an integer`);
  }
  return errors;
}

function IsKillsMap() {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: 'isKillsMap',
      target: object.constructor,
      propertyName,
      validator: {
        validate: (value: unknown) => killsErrors(value).length === 0,
        defaultMessage: (args: ValidationArguments) =>
          killsErrors(args.value).join('; '),
      },
    });
  };
}

/**
 * `POST /progress/mission-complete` body. Only types are validated here (400); value ranges are
 * plausibility checks done by the server scoring (422 + logged).
 */
export class MissionResultDto implements MissionResultInput {
  @ApiProperty({ description: 'Signed run token from mission-start' })
  @IsJWT()
  runToken: string;

  @ApiProperty({ enum: ['victory', 'defeat'] })
  @IsIn(['victory', 'defeat'])
  outcome: 'victory' | 'defeat';

  @ApiProperty({ example: 185000 })
  @IsInt()
  durationMs: number;

  @ApiProperty({
    type: 'object',
    additionalProperties: { type: 'integer' },
    example: { infantry: 12, archer: 4 },
    description: `Keys: ${ENEMY_TYPES.join(', ')}`,
  })
  @IsKillsMap()
  kills: Partial<Record<EnemyType, number>>;

  @ApiProperty({ example: 0 })
  @IsInt()
  bossesDefeated: number;

  @ApiProperty({ example: 40 })
  @IsNumber({ allowNaN: false, allowInfinity: false })
  damageTaken: number;

  @ApiProperty({ example: 6 })
  @IsInt()
  perfectBlocks: number;

  @ApiProperty({ example: 10 })
  @IsInt()
  dodges: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  noHitRounds: number;

  @ApiProperty({ example: 0.75, minimum: 0, maximum: 1 })
  @IsNumber({ allowNaN: false, allowInfinity: false })
  healthRemainingPct: number;

  @ApiProperty({ example: 2 })
  @IsInt()
  livesRemaining: number;

  @ApiProperty({ enum: DIFFICULTIES })
  @IsIn(DIFFICULTIES)
  difficulty: DifficultyId;

  @ApiPropertyOptional({
    enum: CHARACTER_IDS,
    description: 'm07 (Training Grounds) only',
  })
  @IsOptional()
  @IsIn(CHARACTER_IDS)
  trainingCharacterId?: CharacterId;
}
