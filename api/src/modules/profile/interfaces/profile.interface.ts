import { CharacterId } from '@/shared/constants/game.constants';
import { GameSettingsValues } from '../config/settings.config';

export type GameSettings = GameSettingsValues;

export interface ProfileView {
  level: number;
  xp: number;
  xpForNextLevel: number;
  xpIntoLevel: number;
  totalPoints: number;
  title: string;
}

export interface MeResponse {
  id: string;
  email: string;
  username: string;
  emailVerified: boolean;
  createdAt: string;
  profile: ProfileView;
  settings: GameSettings;
  unlockedCharacters: CharacterId[];
}
