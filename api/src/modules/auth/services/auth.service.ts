import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Prisma } from 'generated/prisma';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { ProfileService } from '@/modules/profile/profile.service';
import { DEFAULT_SETTINGS } from '@/modules/profile/config/settings.config';
import { ErrorMessages } from '@/shared/config/error-codes';
import {
  FIRST_MISSION_ID,
  STARTER_CHARACTER_ID,
  UNLOCK_SOURCES,
} from '@/shared/constants/game.constants';
import { containsProfanity } from '@/shared/utils/profanity/profanity.utils';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { AuthResult } from '../interfaces/auth.interface';
import { AuthTokensService } from './auth-tokens.service';
import { EmailVerificationService } from './email-verification.service';

export const BCRYPT_ROUNDS = 10;

@Injectable()
export class AuthService {
  // Compared against when the account does not exist, so login timing does not reveal it.
  private readonly dummyHash = bcrypt.hashSync(
    'not-a-real-password-0',
    BCRYPT_ROUNDS,
  );

  constructor(
    private readonly prisma: PrismaService,
    private readonly tokens: AuthTokensService,
    private readonly profileService: ProfileService,
    private readonly emailVerification: EmailVerificationService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResult> {
    const usernameNormalized = dto.username.toLowerCase();
    if (containsProfanity(dto.username)) {
      throw new BadRequestException(ErrorMessages.Auth.USERNAME_NOT_ALLOWED);
    }

    const [emailOwner, usernameOwner] = await Promise.all([
      this.prisma.user.findUnique({
        where: { email: dto.email },
        select: { id: true },
      }),
      this.prisma.user.findUnique({
        where: { username_normalized: usernameNormalized },
        select: { id: true },
      }),
    ]);
    if (emailOwner) throw new ConflictException(ErrorMessages.Auth.EMAIL_TAKEN);
    if (usernameOwner)
      throw new ConflictException(ErrorMessages.Auth.USERNAME_TAKEN);

    const passwordHash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);

    let user: { id: string; role: string; email: string; username: string };
    try {
      // Nested create runs atomically: user + profile + settings + first mission + starter character.
      user = await this.prisma.user.create({
        data: {
          email: dto.email,
          username: dto.username,
          username_normalized: usernameNormalized,
          password: passwordHash,
          profile: { create: {} },
          settings: {
            create: {
              key_bindings:
                DEFAULT_SETTINGS.keyBindings as unknown as Prisma.InputJsonValue,
            },
          },
          mission_progress: {
            create: { mission_id: FIRST_MISSION_ID, status: 'unlocked' },
          },
          unlocked_characters: {
            create: {
              character_id: STARTER_CHARACTER_ID,
              source: UNLOCK_SOURCES.REGISTRATION,
            },
          },
        },
        select: { id: true, role: true, email: true, username: true },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        const detail = JSON.stringify(error.meta ?? {}) + error.message;
        throw new ConflictException(
          detail.includes('username')
            ? ErrorMessages.Auth.USERNAME_TAKEN
            : ErrorMessages.Auth.EMAIL_TAKEN,
        );
      }
      throw error;
    }

    await this.emailVerification.issueAndSend(
      user.id,
      user.email,
      user.username,
    );

    const tokens = await this.tokens.issueSession(user.id, user.role);
    return { user: await this.profileService.getMe(user.id), tokens };
  }

  async login(dto: LoginDto): Promise<AuthResult> {
    const identifier = dto.identifier.toLowerCase();
    const where = identifier.includes('@')
      ? { email: identifier }
      : { username_normalized: identifier };
    const user = await this.prisma.user.findUnique({
      where,
      select: { id: true, role: true, password: true },
    });

    const valid = await bcrypt.compare(
      dto.password,
      user?.password || this.dummyHash,
    );
    if (!user || !user.password || !valid) {
      throw new UnauthorizedException(ErrorMessages.Auth.INVALID_CREDENTIALS);
    }

    const tokens = await this.tokens.issueSession(user.id, user.role);
    return { user: await this.profileService.getMe(user.id), tokens };
  }
}
