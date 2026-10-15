import { z } from 'zod';
import { parseCorsUrls } from '../cors';

const booleanString = z
  .union([z.boolean(), z.enum(['true', 'false', '1', '0', ''])])
  .optional()
  .transform((value) =>
    value === undefined || value === ''
      ? undefined
      : value === true || value === 'true' || value === '1',
  );

const EnvSchema = z.object({
  NODE_ENV: z.enum(['local', 'development', 'test', 'staging', 'production']),
  PORT: z.coerce.number().default(3000),
  APP_URL: z.string().url().optional(),
  LANDING_URL: z.string().url().optional(),
  CORS_URLS: z.preprocess(parseCorsUrls, z.array(z.string().url()).optional()),
  API_URL: z.string().url().optional(),
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().optional(),
  CACHE_TTL_SECONDS: z.coerce.number().optional(),
  JWT_SECRET: z.string().min(1),
  JWT_REFRESH_SECRET: z.string().min(16),
  RUN_TOKEN_SECRET: z.string().min(16),
  COOKIE_SECURE: booleanString,
  EMPEROR_KNIGHT_POINTS_THRESHOLD: z.coerce
    .number()
    .int()
    .positive()
    .default(60000),
  RESEND_API_KEY: z.string().optional(),
});

export function validateEnv(config: Record<string, unknown>) {
  const normalized = Object.fromEntries(
    Object.entries(config).map(([key, value]) => [
      key,
      value === '' ? undefined : value,
    ]),
  );
  const parsed = EnvSchema.safeParse(normalized);

  if (!parsed.success) {
    console.error(parsed.error.format());
    throw new Error('Invalid environment variables');
  }

  return parsed.data;
}

export type EnvConfig = z.infer<typeof EnvSchema>;
