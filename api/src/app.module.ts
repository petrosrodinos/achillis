import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { ConfigModule } from './shared/config/env/env.module';
import { RateLimits } from './shared/config/throttle';
import { CsrfGuard } from './shared/guards/csrf.guard';
import { AppCacheModule } from './shared/services/cache/cache.module';
import { AuthModule } from './modules/auth/auth.module';
import { HealthModule } from './modules/health/health.module';
import { LeaderboardModule } from './modules/leaderboard/leaderboard.module';
import { ProfileModule } from './modules/profile/profile.module';
import { ProgressModule } from './modules/progress/progress.module';
import { ScoreModule } from './modules/score/score.module';
import { TelemetryModule } from './modules/telemetry/telemetry.module';

@Module({
  imports: [
    ConfigModule,
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        throttlers: [{ name: 'default', ...RateLimits.default }],
        // Automated tests create many accounts from one IP.
        skipIf: () => config.get<string>('NODE_ENV') === 'test',
      }),
    }),
    AppCacheModule,
    AuthModule,
    ProfileModule,
    ProgressModule,
    ScoreModule,
    LeaderboardModule,
    TelemetryModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [
    { provide: APP_GUARD, useClass: CsrfGuard },
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
