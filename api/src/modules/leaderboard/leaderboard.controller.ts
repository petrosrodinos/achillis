import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ZodValidationPipe } from '@/shared/pipes/zod.validation.pipe';
import { CurrentUser } from '@/shared/decorators/current-user.decorator';
import { JwtGuard, OptionalJwtGuard } from '@/shared/guards/jwt.guard';
import { MISSION_IDS } from '@/shared/constants/game.constants';
import {
  LeaderboardQuerySchema,
  type LeaderboardQueryType,
} from './dto/leaderboard-query.schema';
import {
  LeaderboardMeEntity,
  LeaderboardResponseEntity,
} from './entities/leaderboard.entity';
import { LeaderboardService } from './leaderboard.service';

const LeaderboardQueries =
  () => (target: object, key: string, descriptor: PropertyDescriptor) => {
    ApiQuery({ name: 'scope', required: false, enum: ['global', 'mission'] })(
      target,
      key,
      descriptor,
    );
    ApiQuery({ name: 'missionId', required: false, enum: MISSION_IDS })(
      target,
      key,
      descriptor,
    );
    ApiQuery({
      name: 'window',
      required: false,
      enum: ['all', 'monthly', 'weekly'],
    })(target, key, descriptor);
    ApiQuery({ name: 'sort', required: false, enum: ['points', 'time'] })(
      target,
      key,
      descriptor,
    );
    ApiQuery({ name: 'page', required: false, type: Number })(
      target,
      key,
      descriptor,
    );
    ApiQuery({
      name: 'limit',
      required: false,
      type: Number,
      description: '1–100, default 20',
    })(target, key, descriptor);
  };

@ApiTags('Leaderboard')
@Controller('leaderboard')
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) {}

  @Get()
  @UseGuards(OptionalJwtGuard)
  @LeaderboardQueries()
  @ApiOperation({
    summary:
      'Public leaderboard (cached 30 s); highlights the current user when logged in',
  })
  @ApiOkResponse({ type: LeaderboardResponseEntity })
  getLeaderboard(
    @Query(new ZodValidationPipe(LeaderboardQuerySchema))
    query: LeaderboardQueryType,
    @CurrentUser('id') userId: string | null,
  ) {
    return this.leaderboardService.getLeaderboard(query, userId ?? null);
  }

  @Get('me')
  @UseGuards(JwtGuard)
  @ApiCookieAuth('wk_access')
  @LeaderboardQueries()
  @ApiOperation({
    summary: "The current user's rank for the given board (null when unranked)",
  })
  @ApiOkResponse({ type: LeaderboardMeEntity })
  getMyEntry(
    @Query(new ZodValidationPipe(LeaderboardQuerySchema))
    query: LeaderboardQueryType,
    @CurrentUser('id') userId: string,
  ) {
    return this.leaderboardService.getMyEntry(query, userId);
  }
}
