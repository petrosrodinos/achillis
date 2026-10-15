import type { Profile, Settings } from 'generated/prisma';
import { CharacterId, CHARACTER_IDS } from '@/shared/constants/game.constants';
import { GameSettings, ProfileView } from '../interfaces/profile.interface';
import { levelInfo } from './level-curve.utils';
import { mergeKeyBindings } from './key-bindings.utils';

export function toProfileView(
  profile: Pick<Profile, 'xp' | 'total_points'>,
): ProfileView {
  const info = levelInfo(profile.xp);
  return {
    level: info.level,
    xp: info.xp,
    xpForNextLevel: info.xpForNextLevel,
    xpIntoLevel: info.xpIntoLevel,
    totalPoints: profile.total_points,
    title: info.title,
  };
}

export function toGameSettings(settings: Settings): GameSettings {
  return {
    masterVolume: settings.master_volume,
    musicVolume: settings.music_volume,
    sfxVolume: settings.sfx_volume,
    reducedMotion: settings.reduced_motion,
    screenShake: settings.screen_shake,
    showFps: settings.show_fps,
    difficulty: settings.difficulty,
    keyBindings: mergeKeyBindings(settings.key_bindings),
  };
}

/** Sorted in catalog order so the client gets a stable list. */
export function sortCharacterIds(ids: string[]): CharacterId[] {
  return CHARACTER_IDS.filter((id) => ids.includes(id));
}
