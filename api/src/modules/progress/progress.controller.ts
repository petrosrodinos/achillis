import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { RateLimits } from '@/shared/config/throttle';
import { CurrentUser } from '@/shared/decorators/current-user.decorator';
import { JwtGuard } from '@/shared/guards/jwt.guard';
import { MissionResultDto } from './dto/mission-result.dto';
import { MissionStartDto } from './dto/mission-start.dto';
import {
  MissionCompleteEntity,
  MissionStartEntity,
  ProgressEntity,
} from './entities/progress.entity';
import { ProgressService } from './progress.service';

@ApiTags('Progress')
@ApiCookieAuth('wk_access')
@Controller('progress')
@UseGuards(JwtGuard)
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Get()
  @ApiOperation({ summary: 'Campaign progress (save)' })
  @ApiResponse({ status: 200, type: ProgressEntity })
  getProgress(@CurrentUser('id') userId: string) {
    return this.progressService.getProgress(userId);
  }

  @Post('mission-start')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Start a mission run; returns a signed run token (auto-saves)',
  })
  @ApiResponse({ status: 201, type: MissionStartEntity })
  @ApiResponse({ status: 403, description: 'Mission is locked' })
  startMission(
    @CurrentUser('id') userId: string,
    @Body() dto: MissionStartDto,
  ) {
    return this.progressService.startMission(userId, dto.missionId);
  }

  @Post('mission-complete')
  @HttpCode(HttpStatus.OK)
  @Throttle(RateLimits.missionComplete)
  @ApiOperation({
    summary:
      'Submit a run result; the server validates and scores it (auto-saves)',
  })
  @ApiResponse({ status: 200, type: MissionCompleteEntity })
  @ApiResponse({
    status: 422,
    description: 'Invalid/replayed run token or implausible result (logged)',
  })
  completeMission(
    @CurrentUser('id') userId: string,
    @Body() dto: MissionResultDto,
  ) {
    return this.progressService.completeMission(userId, dto);
  }
}
