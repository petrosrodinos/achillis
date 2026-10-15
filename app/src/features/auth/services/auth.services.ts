import { api } from '@/api/client';
import type { MeResponse } from '@/api/types';

export interface RegisterDto {
  email: string;
  username: string;
  password: string;
}

export interface LoginDto {
  /** Email or username. */
  identifier: string;
  password: string;
}

/** `/auth/*` endpoints (contracts §2.1). */
export const authApi = {
  register: (dto: RegisterDto) => api.post<{ user: MeResponse }>('/auth/register', dto),
  login: (dto: LoginDto) => api.post<{ user: MeResponse }>('/auth/login', dto),
  logout: () => api.post<void>('/auth/logout'),
  verifyEmail: (token: string) => api.post<{ ok: true }>('/auth/verify-email', { token }),
  resendVerification: () => api.post<{ ok: true }>('/auth/resend-verification'),
  forgotPassword: (email: string) => api.post<{ ok: true }>('/auth/forgot-password', { email }),
  resetPassword: (token: string, password: string) => api.post<{ ok: true }>('/auth/reset-password', { token, password }),
};
