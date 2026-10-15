import { defineConfig, devices } from '@playwright/test';

/**
 * End-to-end tests (spec §19: register → play → score → leaderboard).
 * Runs against the Vite dev server (the dev-only `window.__wkEngine` hook is used to fast-forward
 * gameplay deterministically) and the API started with `npm run start:staging` in ../api.
 */
const CLIENT = process.env.E2E_BASE_URL ?? 'http://localhost:5180';

export default defineConfig({
  testDir: './e2e',
  timeout: 180_000,
  expect: { timeout: 15_000 },
  fullyParallel: false,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: CLIENT,
    trace: 'retain-on-failure',
    viewport: { width: 1440, height: 900 },
  },
  projects: [
    { name: 'desktop-chrome', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
    { name: 'tablet', use: { ...devices['iPad Pro 11 landscape'] }, testMatch: /responsive\.spec\.ts/ },
  ],
  webServer: [
    {
      command: 'npm run start:staging',
      cwd: '../api',
      url: 'http://localhost:3917/api/health',
      reuseExistingServer: true,
      timeout: 120_000,
    },
    {
      command: 'npm run dev',
      url: CLIENT,
      reuseExistingServer: true,
      timeout: 60_000,
    },
  ],
});
