import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { ErrorMessages } from '@/shared/config/error-codes';
import { generateOpaqueToken, hashToken } from '../utils/token.utils';
import { AuthMailService } from './auth-mail.service';
import { OkResponse } from '../interfaces/auth.interface';

const VERIFICATION_TOKEN_TTL_MS = 24 * 60 * 60 * 1000;

@Injectable()
export class EmailVerificationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authMail: AuthMailService,
  ) {}

  /** Invalidates previous unused tokens, stores a new hashed token and sends the email (fire-and-forget). */
  async issueAndSend(
    userId: string,
    email: string,
    username: string,
  ): Promise<void> {
    const token = generateOpaqueToken();
    await this.prisma.$transaction([
      this.prisma.emailVerificationToken.updateMany({
        where: { user_id: userId, used_at: null },
        data: { used_at: new Date() },
      }),
      this.prisma.emailVerificationToken.create({
        data: {
          user_id: userId,
          token_hash: hashToken(token),
          expires_at: new Date(Date.now() + VERIFICATION_TOKEN_TTL_MS),
        },
      }),
    ]);
    this.authMail.sendVerificationEmail(email, username, token);
  }

  async verify(token: string): Promise<OkResponse> {
    const record = await this.prisma.emailVerificationToken.findUnique({
      where: { token_hash: hashToken(token) },
    });
    if (!record || record.used_at || record.expires_at <= new Date()) {
      throw new BadRequestException(
        ErrorMessages.Auth.INVALID_VERIFICATION_TOKEN,
      );
    }

    const now = new Date();
    await this.prisma.$transaction([
      this.prisma.emailVerificationToken.update({
        where: { id: record.id },
        data: { used_at: now },
      }),
      this.prisma.user.updateMany({
        where: { id: record.user_id, email_verified_at: null },
        data: { email_verified_at: now },
      }),
    ]);
    return { ok: true };
  }

  async resend(userId: string): Promise<OkResponse> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        username: true,
        email_verified_at: true,
      },
    });
    if (!user) throw new NotFoundException('User not found');
    if (!user.email_verified_at)
      await this.issueAndSend(user.id, user.email, user.username);
    return { ok: true };
  }
}
