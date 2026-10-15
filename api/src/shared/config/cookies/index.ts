import type { CookieOptions } from 'express';

export const ACCESS_COOKIE = 'wk_access';
export const REFRESH_COOKIE = 'wk_refresh';

export const ACCESS_TOKEN_TTL_MS = 15 * 60 * 1000; // 15 min
export const REFRESH_TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

export const REFRESH_COOKIE_PATH = '/api/auth';

export const accessCookieOptions = (secure: boolean): CookieOptions => ({
  httpOnly: true,
  sameSite: 'lax',
  secure,
  path: '/',
  maxAge: ACCESS_TOKEN_TTL_MS,
});

export const refreshCookieOptions = (secure: boolean): CookieOptions => ({
  httpOnly: true,
  sameSite: 'lax',
  secure,
  path: REFRESH_COOKIE_PATH,
  maxAge: REFRESH_TOKEN_TTL_MS,
});
