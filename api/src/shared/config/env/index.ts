import { parseCorsUrls } from '../cors';

const emptyToUndefined = (value: string | undefined) =>
  value === '' ? undefined : value;

export default () => ({
  NODE_ENV: process.env.NODE_ENV,
  PORT: Number(process.env.PORT ?? 3000),
  APP_URL: emptyToUndefined(process.env.APP_URL),
  LANDING_URL: emptyToUndefined(process.env.LANDING_URL),
  CORS_URLS: parseCorsUrls(process.env.CORS_URLS),
  API_URL: emptyToUndefined(process.env.API_URL),
  DATABASE_URL: process.env.DATABASE_URL,
  REDIS_URL: emptyToUndefined(process.env.REDIS_URL),
  CACHE_TTL_SECONDS: process.env.CACHE_TTL_SECONDS
    ? Number(process.env.CACHE_TTL_SECONDS)
    : undefined,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  RUN_TOKEN_SECRET: process.env.RUN_TOKEN_SECRET,
  COOKIE_SECURE:
    emptyToUndefined(process.env.COOKIE_SECURE) === undefined
      ? undefined
      : process.env.COOKIE_SECURE === 'true' ||
        process.env.COOKIE_SECURE === '1',
  EMPEROR_KNIGHT_POINTS_THRESHOLD: process.env.EMPEROR_KNIGHT_POINTS_THRESHOLD
    ? Number(process.env.EMPEROR_KNIGHT_POINTS_THRESHOLD)
    : 60000,
  RESEND_API_KEY: emptyToUndefined(process.env.RESEND_API_KEY),
});
