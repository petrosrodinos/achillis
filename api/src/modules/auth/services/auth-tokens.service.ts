import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import {
  ACCESS_TOKEN_TTL_MS,
  REFRESH_TOKEN_TTL_MS,
} from '@/shared/config/cookies';
import { ErrorMessages } from '@/shared/config/error-codes';
import {
  AccessTokenPayload,
  RefreshTokenPayload,
  SessionTokens,
} from '../interfaces/auth.interface';
import { hashToken } from '../utils/token.utils';

/**
 * Access tokens: 15 min JWTs (JWT_SECRET).
 * Refresh tokens: 30 day JWTs (JWT_REFRESH_SECRET) stored as sha256 hashes, rotated on every use.
 * Presenting an already-rotated (revoked) refresh token revokes its whole family (reuse detection).
 */
@Injectable()
export class AuthTokensService {
  private readonly logger = new Logger(AuthTokensService.name);
  private readonly accessSecret: string;
  private readonly refreshSecret: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    config: ConfigService,
  ) {
    this.accessSecret = config.getOrThrow<string>('JWT_SECRET');
    this.refreshSecret = config.getOrThrow<string>('JWT_REFRESH_SECRET');
  }

  async issueSession(
    userId: string,
    role: string,
    familyId: string = randomUUID(),
  ): Promise<SessionTokens> {
    const accessToken = await this.signAccessToken(userId, role);
    const { token: refreshToken } = await this.createRefreshToken(
      userId,
      familyId,
    );
    return { accessToken, refreshToken };
  }

  async rotate(refreshToken: string | undefined): Promise<SessionTokens> {
    if (!refreshToken)
      throw new UnauthorizedException(ErrorMessages.Auth.INVALID_REFRESH_TOKEN);

    let payload: RefreshTokenPayload;
    try {
      payload = await this.jwt.verifyAsync<RefreshTokenPayload>(refreshToken, {
        secret: this.refreshSecret,
      });
    } catch {
      throw new UnauthorizedException(ErrorMessages.Auth.INVALID_REFRESH_TOKEN);
    }
    if (payload.typ !== 'refresh')
      throw new UnauthorizedException(ErrorMessages.Auth.INVALID_REFRESH_TOKEN);

    const stored = await this.prisma.refreshToken.findUnique({
      where: { token_hash: hashToken(refreshToken) },
      include: { user: { select: { id: true, role: true } } },
    });
    if (!stored)
      throw new UnauthorizedException(ErrorMessages.Auth.INVALID_REFRESH_TOKEN);

    if (stored.revoked_at) {
      await this.revokeFamily(stored.family_id);
      this.logger.warn(
        `Refresh token reuse detected — revoked family ${stored.family_id} (user ${stored.user_id})`,
      );
      throw new UnauthorizedException(ErrorMessages.Auth.INVALID_REFRESH_TOKEN);
    }
    if (stored.expires_at <= new Date()) {
      throw new UnauthorizedException(ErrorMessages.Auth.INVALID_REFRESH_TOKEN);
    }

    // Atomically claim the token so two concurrent refreshes cannot both succeed.
    const claimed = await this.prisma.refreshToken.updateMany({
      where: { id: stored.id, revoked_at: null },
      data: { revoked_at: new Date() },
    });
    if (claimed.count === 0) {
      await this.revokeFamily(stored.family_id);
      this.logger.warn(
        `Concurrent refresh token reuse — revoked family ${stored.family_id}`,
      );
      throw new UnauthorizedException(ErrorMessages.Auth.INVALID_REFRESH_TOKEN);
    }

    const accessToken = await this.signAccessToken(
      stored.user.id,
      stored.user.role,
    );
    const next = await this.createRefreshToken(
      stored.user.id,
      stored.family_id,
    );
    await this.prisma.refreshToken.update({
      where: { id: stored.id },
      data: { replaced_by: next.id },
    });

    return { accessToken, refreshToken: next.token };
  }

  /** Revokes the family of the given refresh token (logout). Silently ignores unknown tokens. */
  async revokeByToken(refreshToken: string | undefined): Promise<void> {
    if (!refreshToken) return;
    const stored = await this.prisma.refreshToken.findUnique({
      where: { token_hash: hashToken(refreshToken) },
    });
    if (stored) await this.revokeFamily(stored.family_id);
  }

  async revokeAllForUser(userId: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: { user_id: userId, revoked_at: null },
      data: { revoked_at: new Date() },
    });
  }

  private async revokeFamily(familyId: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: { family_id: familyId, revoked_at: null },
      data: { revoked_at: new Date() },
    });
  }

  private signAccessToken(userId: string, role: string): Promise<string> {
    const payload: AccessTokenPayload = { sub: userId, role, typ: 'access' };
    return this.jwt.signAsync(payload, {
      secret: this.accessSecret,
      expiresIn: Math.floor(ACCESS_TOKEN_TTL_MS / 1000),
    });
  }

  private async createRefreshToken(
    userId: string,
    familyId: string,
  ): Promise<{ id: string; token: string }> {
    const id = randomUUID();
    const payload: RefreshTokenPayload = {
      sub: userId,
      fid: familyId,
      jti: id,
      typ: 'refresh',
    };
    const token = await this.jwt.signAsync(payload, {
      secret: this.refreshSecret,
      expiresIn: Math.floor(REFRESH_TOKEN_TTL_MS / 1000),
    });
    await this.prisma.refreshToken.create({
      data: {
        id,
        user_id: userId,
        family_id: familyId,
        token_hash: hashToken(token),
        expires_at: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
      },
    });
    return { id, token };
  }
}
