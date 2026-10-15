import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from 'generated/prisma';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { GameSettings, MeResponse } from './interfaces/profile.interface';
import { mergeKeyBindings } from './utils/key-bindings.utils';
import {
  sortCharacterIds,
  toGameSettings,
  toProfileView,
} from './utils/profile.utils';
import { DEFAULT_SETTINGS } from './config/settings.config';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async getMe(userId: string): Promise<MeResponse> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        settings: true,
        unlocked_characters: { select: { character_id: true } },
      },
    });
    if (!user || !user.profile) throw new NotFoundException('User not found');

    const settings = user.settings ?? (await this.ensureSettings(userId));

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      emailVerified: Boolean(user.email_verified_at),
      createdAt: user.created_at.toISOString(),
      profile: toProfileView(user.profile),
      settings: toGameSettings(settings),
      unlockedCharacters: sortCharacterIds(
        user.unlocked_characters.map((c) => c.character_id),
      ),
    };
  }

  async updateSettings(
    userId: string,
    dto: UpdateSettingsDto,
  ): Promise<GameSettings> {
    const current = await this.ensureSettings(userId);

    const data: Prisma.SettingsUpdateInput = {
      ...(dto.masterVolume !== undefined && {
        master_volume: dto.masterVolume,
      }),
      ...(dto.musicVolume !== undefined && { music_volume: dto.musicVolume }),
      ...(dto.sfxVolume !== undefined && { sfx_volume: dto.sfxVolume }),
      ...(dto.reducedMotion !== undefined && {
        reduced_motion: dto.reducedMotion,
      }),
      ...(dto.screenShake !== undefined && { screen_shake: dto.screenShake }),
      ...(dto.showFps !== undefined && { show_fps: dto.showFps }),
      ...(dto.difficulty !== undefined && { difficulty: dto.difficulty }),
      ...(dto.keyBindings !== undefined && {
        key_bindings: mergeKeyBindings(
          current.key_bindings,
          dto.keyBindings,
        ) as unknown as Prisma.InputJsonValue,
      }),
    };

    const updated = await this.prisma.settings.update({
      where: { user_id: userId },
      data,
    });
    return toGameSettings(updated);
  }

  private ensureSettings(userId: string) {
    return this.prisma.settings.upsert({
      where: { user_id: userId },
      update: {},
      create: {
        user_id: userId,
        key_bindings:
          DEFAULT_SETTINGS.keyBindings as unknown as Prisma.InputJsonValue,
      },
    });
  }
}
