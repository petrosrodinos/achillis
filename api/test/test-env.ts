// Shared e2e environment. The test database lives in the same docker container as the dev DB.
export const TEST_DATABASE_URL =
  process.env.E2E_DATABASE_URL ??
  'postgresql://wk:wk_local_pw@localhost:5433/white_knight_test';

export const TEST_ENV: Record<string, string> = {
  NODE_ENV: 'test',
  DATABASE_URL: TEST_DATABASE_URL,
  JWT_SECRET: 'e2e-access-secret-0123456789',
  JWT_REFRESH_SECRET: 'e2e-refresh-secret-0123456789',
  RUN_TOKEN_SECRET: 'e2e-run-token-secret-0123456789',
  COOKIE_SECURE: 'false',
  APP_URL: 'http://localhost:5173',
  EMPEROR_KNIGHT_POINTS_THRESHOLD: '60000',
  RESEND_API_KEY: '',
  REDIS_URL: '',
};
