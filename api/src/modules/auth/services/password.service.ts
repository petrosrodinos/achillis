import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { ErrorMessages } from '@/shared/config/error-codes';
import { ForgotPasswordDto, ResetPasswordDto } from '../dto/token.dto';
import { OkResponse } from '../interfaces/auth.interface';
import { generateOpaqueToken, hashToken } from '../utils/token.utils';
import { AuthMailService } from './auth-mail.service';
import { AuthTokensService } from './auth-tokens.service';
import { BCRYPT_ROUNDS } from './auth.service';

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000;

@Injectable()
export class PasswordService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authMail: AuthMailService,
    private readonly tokens: AuthTokensService,
  ) {}

  /** Always resolves with `{ ok: true }` — never reveals whether the account exists. */
  async forgotPassword(dto: ForgotPasswordDto): Promise<OkResponse> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      select: { id: true, email: true, username: true },
    });

    if (user) {
      const token = generateOpaqueToken();
      await this.prisma.$transaction([
        this.prisma.passwordResetToken.updateMany({
          where: { user_id: user.id, used_at: null },
          data: { used_at: new Date() },
        }),
        this.prisma.passwordResetToken.create({
          data: {
            user_id: user.id,
            token_hash: hashToken(token),
            expires_at: new Date(Date.now() + RESET_TOKEN_TTL_MS),
          },
        }),
      ]);
      this.authMail.sendPasswordResetEmail(user.email, user.username, token);
    }

    return { ok: true };
  }

  /** Sets the new password, consumes the token and revokes every refresh token of the user. */
  async resetPassword(dto: ResetPasswordDto): Promise<OkResponse> {
    const record = await this.prisma.passwordResetToken.findUnique({
      where: { token_hash: hashToken(dto.token) },
    });
    if (!record || record.used_at || record.expires_at <= new Date()) {
      throw new BadRequestException(ErrorMessages.Auth.INVALID_RESET_TOKEN);
    }

    const passwordHash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);
    const now = new Date();
    await this.prisma.$transaction(async (tx) => {
      // Claim the token atomically so it can only ever be used once.
      const claimed = await tx.passwordResetToken.updateMany({
        where: { id: record.id, used_at: null },
        data: { used_at: now },
      });
      if (claimed.count === 0) {
        throw new BadRequestException(ErrorMessages.Auth.INVALID_RESET_TOKEN);
      }
      await tx.user.update({
        where: { id: record.user_id },
        data: { password: passwordHash },
      });
      await tx.passwordResetToken.updateMany({
        where: { user_id: record.user_id, used_at: null },
        data: { used_at: now },
      });
    });
    await this.tokens.revokeAllForUser(record.user_id);

    return { ok: true };
  }
}
