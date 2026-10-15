import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsIn,
  IsNumber,
  IsOptional,
  Max,
  Min,
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';
import { DIFFICULTIES, DifficultyId } from '@/shared/constants/game.constants';
import { DEFAULT_KEY_BINDINGS, KeyBindings } from '../config/settings.config';
import { validateKeyBindings } from '../utils/key-bindings.utils';

function IsKeyBindings(options?: ValidationOptions) {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: 'isKeyBindings',
      target: object.constructor,
      propertyName,
      options,
      validator: {
        validate: (value: unknown) => validateKeyBindings(value).length === 0,
        defaultMessage: (args: ValidationArguments) =>
          validateKeyBindings(args.value).join('; '),
      },
    });
  };
}

/** `PATCH /me/settings` body — every field optional (Partial<GameSettings>). */
export class UpdateSettingsDto {
  @ApiPropertyOptional({ minimum: 0, maximum: 1, example: 0.8 })
  @IsOptional()
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @Min(0)
  @Max(1)
  masterVolume?: number;

  @ApiPropertyOptional({ minimum: 0, maximum: 1, example: 0.6 })
  @IsOptional()
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @Min(0)
  @Max(1)
  musicVolume?: number;

  @ApiPropertyOptional({ minimum: 0, maximum: 1, example: 0.8 })
  @IsOptional()
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @Min(0)
  @Max(1)
  sfxVolume?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  reducedMotion?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  screenShake?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  showFps?: boolean;

  @ApiPropertyOptional({ enum: DIFFICULTIES })
  @IsOptional()
  @IsIn(DIFFICULTIES)
  difficulty?: DifficultyId;

  @ApiPropertyOptional({
    description:
      'Partial map of GameAction → KeyboardEvent.code values (or Mouse0/1/2). Merged into stored bindings.',
    example: { dodge: ['Space'], block: ['ShiftLeft'] },
    type: 'object',
    additionalProperties: { type: 'array', items: { type: 'string' } },
    default: DEFAULT_KEY_BINDINGS,
  })
  @IsOptional()
  @IsKeyBindings()
  keyBindings?: Partial<KeyBindings>;
}
