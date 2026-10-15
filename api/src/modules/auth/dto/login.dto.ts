import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ description: 'Email or username', example: 'Sir_Galahad' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @MinLength(3)
  @MaxLength(254)
  identifier: string;

  @ApiProperty({ example: 'Excalibur42' })
  @IsString()
  @MinLength(1)
  @MaxLength(72)
  password: string;
}
