import type { LeaderboardScope, LeaderboardSort, LeaderboardWindow } from '@/api/types';

export const LeaderboardScopeOptions: { id: LeaderboardScope; label: string }[] = [
  { id: 'global', label: 'Global' },
  { id: 'mission', label: 'Per mission' },
];

export const LeaderboardWindowOptions: { id: LeaderboardWindow; label: string }[] = [
  { id: 'all', label: 'All-time' },
  { id: 'monthly', label: 'Monthly' },
  { id: 'weekly', label: 'Weekly' },
];

export const LeaderboardSortOptions: { value: LeaderboardSort; label: string }[] = [
  { value: 'points', label: 'Best score' },
  { value: 'time', label: 'Fastest time' },
];
