import { api } from '@/api/client';
import type { GameSettings, MeResponse } from '@/api/types';

/** `/me` endpoints (contracts §2.2). */
export const meApi = {
  get: () => api.get<MeResponse>('/me'),
  updateSettings: (patch: Partial<GameSettings>) => api.patch<GameSettings>('/me/settings', patch, { idempotent: true, retries: 2 }),
};
