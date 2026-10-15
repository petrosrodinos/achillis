import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '@/core/databases/prisma/prisma.module';
import { LeaderboardModule } from '@/modules/leaderboard/leaderboard.module';
import { ScoreModule } from '@/modules/score/score.module';
import { ProgressController } from './progress.controller';
import { ProgressService } from './progress.service';

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({}),
    ScoreModule,
    LeaderboardModule,
  ],
  controllers: [ProgressController],
  providers: [ProgressService],
})
export class ProgressModule {}
