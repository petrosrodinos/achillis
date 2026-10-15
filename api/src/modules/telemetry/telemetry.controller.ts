import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { RateLimits } from '@/shared/config/throttle';
import { ClientErrorDto } from './dto/client-error.dto';
import { TelemetryService } from './telemetry.service';

@ApiTags('Telemetry')
@Controller('telemetry')
export class TelemetryController {
  constructor(private readonly telemetryService: TelemetryService) {}

  @Post('client-error')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Throttle(RateLimits.telemetry)
  @ApiOperation({
    summary: 'Report a client-side error (public, 20/min/IP, body ≤ 16 KB)',
  })
  @ApiResponse({ status: 204 })
  @ApiResponse({ status: 413, description: 'Payload larger than 16 KB' })
  reportClientError(@Body() dto: ClientErrorDto): void {
    this.telemetryService.recordClientError(dto);
  }
}
