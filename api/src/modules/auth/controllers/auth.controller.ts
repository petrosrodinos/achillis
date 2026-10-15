import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ApiBody,
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import type { Request, Response } from 'express';
import {
  ACCESS_COOKIE,
  accessCookieOptions,
  REFRESH_COOKIE,
  refreshCookieOptions,
} from '@/shared/config/cookies';
import { RateLimits } from '@/shared/config/throttle';
import { CurrentUser } from '@/shared/decorators/current-user.decorator';
import { JwtGuard } from '@/shared/guards/jwt.guard';
import { UserEnvelopeEntity } from '@/modules/profile/entities/me.entity';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import {
  ForgotPasswordDto,
  ResetPasswordDto,
  VerifyEmailDto,
} from '../dto/token.dto';
import { OkEntity } from '../entities/ok.entity';
import { SessionTokens } from '../interfaces/auth.interface';
import { AuthService } from '../services/auth.service';
import { AuthTokensService } from '../services/auth-tokens.service';
import { EmailVerificationService } from '../services/email-verification.service';
import { PasswordService } from '../services/password.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  private readonly secureCookies: boolean;

  constructor(
    private readonly authService: AuthService,
    private readonly tokens: AuthTokensService,
    private readonly emailVerification: EmailVerificationService,
    private readonly passwordService: PasswordService,
    config: ConfigService,
  ) {
    const explicit = config.get<boolean>('COOKIE_SECURE');
    this.secureCookies =
      explicit ?? config.get<string>('NODE_ENV') === 'production';
  }

  @Post('register')
  @Throttle(RateLimits.register)
  @ApiOperation({
    summary: 'Create an account; sets wk_access + wk_refresh cookies',
  })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: 201, type: UserEnvelopeEntity })
  @ApiResponse({
    status: 400,
    description: 'Validation failed or username not allowed',
  })
  @ApiResponse({ status: 409, description: 'Email or username already taken' })
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, tokens } = await this.authService.register(dto);
    this.setSessionCookies(res, tokens);
    return { user };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Throttle(RateLimits.login)
  @ApiOperation({ summary: 'Log in with email or username; sets cookies' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, type: UserEnvelopeEntity })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, tokens } = await this.authService.login(dto);
    this.setSessionCookies(res, tokens);
    return { user };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @Throttle(RateLimits.refresh)
  @ApiCookieAuth(REFRESH_COOKIE)
  @ApiOperation({
    summary:
      'Rotate the refresh token (wk_refresh cookie) and issue a new access token',
  })
  @ApiResponse({ status: 200, type: OkEntity })
  @ApiResponse({
    status: 401,
    description: 'Missing, invalid, expired or reused refresh token',
  })
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const tokens = await this.tokens.rotate(req.cookies?.[REFRESH_COOKIE]);
      this.setSessionCookies(res, tokens);
      return { ok: true };
    } catch (error) {
      this.clearSessionCookies(res);
      throw error;
    }
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Revoke the refresh token family and clear cookies',
  })
  @ApiResponse({ status: 204 })
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    await this.tokens.revokeByToken(req.cookies?.[REFRESH_COOKIE]);
    this.clearSessionCookies(res);
  }

  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Confirm an email address with the token from the email link',
  })
  @ApiResponse({ status: 200, type: OkEntity })
  @ApiResponse({ status: 400, description: 'Invalid or expired token' })
  verifyEmail(@Body() dto: VerifyEmailDto) {
    return this.emailVerification.verify(dto.token);
  }

  @Post('resend-verification')
  @HttpCode(HttpStatus.ACCEPTED)
  @UseGuards(JwtGuard)
  @Throttle(RateLimits.forgotPassword)
  @ApiCookieAuth(ACCESS_COOKIE)
  @ApiOperation({
    summary: 'Send a new verification email (no-op when already verified)',
  })
  @ApiResponse({ status: 202, type: OkEntity })
  resendVerification(@CurrentUser('id') userId: string) {
    return this.emailVerification.resend(userId);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.ACCEPTED)
  @Throttle(RateLimits.forgotPassword)
  @ApiOperation({
    summary:
      'Request a password reset email (always 202, no account enumeration)',
  })
  @ApiResponse({ status: 202, type: OkEntity })
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.passwordService.forgotPassword(dto);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @Throttle(RateLimits.resetPassword)
  @ApiOperation({
    summary: 'Set a new password with the reset token; revokes all sessions',
  })
  @ApiResponse({ status: 200, type: OkEntity })
  @ApiResponse({
    status: 400,
    description: 'Invalid or expired token / weak password',
  })
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.passwordService.resetPassword(dto);
  }

  private setSessionCookies(res: Response, tokens: SessionTokens) {
    res.cookie(
      ACCESS_COOKIE,
      tokens.accessToken,
      accessCookieOptions(this.secureCookies),
    );
    res.cookie(
      REFRESH_COOKIE,
      tokens.refreshToken,
      refreshCookieOptions(this.secureCookies),
    );
  }

  private clearSessionCookies(res: Response) {
    const { maxAge: _a, ...access } = accessCookieOptions(this.secureCookies);
    const { maxAge: _r, ...refresh } = refreshCookieOptions(this.secureCookies);
    res.clearCookie(ACCESS_COOKIE, access);
    res.clearCookie(REFRESH_COOKIE, refresh);
  }
}
