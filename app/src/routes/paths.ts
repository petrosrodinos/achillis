import type { CharacterId, MissionId } from '@/content/ids';

export const Paths = {
  title: '/',
  login: '/login',
  register: '/register',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password',
  verifyEmail: '/verify-email',
  menu: '/menu',
  campaign: '/campaign',
  briefing: (id: MissionId) => `/campaign/${id}`,
  training: '/training',
  /** The game itself. Owned by pages/play. */
  play: (id: MissionId) => `/play/${id}`,
  playTraining: (player: CharacterId, opponent: CharacterId, mounted: boolean) =>
    `/play/m07?player=${player}&opponent=${opponent}&mounted=${mounted ? 1 : 0}`,
  leaderboard: '/leaderboard',
  profile: '/profile',
  settings: '/settings',
  unsupported: '/unsupported',
  error: '/error',
  /** Dev-only design-system showcase (registered only when import.meta.env.DEV). */
  devUi: '/dev/ui',
} as const;
