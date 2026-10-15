import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsObject, IsOptional, IsString, MaxLength } from 'class-validator';

/** `POST /telemetry/client-error` body. The whole request body is capped at 16 KB in `app.setup.ts`. */
export class ClientErrorDto {
  @ApiProperty({ example: 'TypeError: Cannot read properties of undefined' })
  @IsString()
  @MaxLength(2000)
  message: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(10000)
  stack?: string;

  @ApiProperty({ example: 'http://localhost:5173/play/m02' })
  @IsString()
  @MaxLength(2000)
  url: string;

  @ApiProperty({ example: 'Mozilla/5.0 …' })
  @IsString()
  @MaxLength(512)
  userAgent: string;

  @ApiPropertyOptional({ type: 'object', additionalProperties: true })
  @IsOptional()
  @IsObject()
  context?: Record<string, unknown>;
}
