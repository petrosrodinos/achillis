import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from '@/core/databases/prisma/prisma.module';
import { ResendModule } from '@/integrations/notifications/resend/resend.module';
import { ProfileModule } from '@/modules/profile/profile.module';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { AuthTokensService } from './services/auth-tokens.service';
import { AuthMailService } from './services/auth-mail.service';
import { EmailVerificationService } from './services/email-verification.service';
import { PasswordService } from './services/password.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    PrismaModule,
    PassportModule,
    JwtModule.register({}),
    ResendModule,
    ProfileModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthTokensService,
    AuthMailService,
    EmailVerificationService,
    PasswordService,
    JwtStrategy,
  ],
  exports: [AuthTokensService],
})
export class AuthModule {}
