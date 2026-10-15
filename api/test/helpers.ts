import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Client } from 'pg';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { configureApp } from '../src/app.setup';
import { containsProfanity } from '../src/shared/utils/profanity/profanity.utils';
import { TEST_DATABASE_URL } from './test-env';

export const XHR = { 'X-Requested-With': 'XMLHttpRequest' };

export async function createTestApp(): Promise<INestApplication> {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();
  const app = moduleRef.createNestApplication({
    bodyParser: false,
    logger: ['error'],
  });
  configureApp(app, { requestLogging: false });
  await app.init();
  return app;
}

let counter = 0;
export function uniqueUser(prefix = 'knight'): {
  email: string;
  username: string;
  password: string;
} {
  counter += 1;
  const tag = `${Date.now().toString(36)}${counter}`.slice(-10);
  const username = `${prefix}_${tag}`.slice(0, 20);
  // Random tags can accidentally spell a filtered word in leetspeak — just draw again.
  if (containsProfanity(username)) return uniqueUser(prefix);
  return {
    email: `${prefix}.${tag}@example.com`,
    username,
    password: 'Excalibur42',
  };
}

/** Registers a user and returns a cookie-keeping agent. */
export async function registerAgent(app: INestApplication, prefix?: string) {
  const agent = request.agent(app.getHttpServer());
  const user = uniqueUser(prefix);
  const res = await agent
    .post('/api/auth/register')
    .set(XHR)
    .send(user)
    .expect(201);
  return { agent, user, me: res.body.user };
}

/** Direct DB access for test-only time travel (moving a run's start into the past). */
export async function withDb<T>(
  fn: (client: Client) => Promise<T>,
): Promise<T> {
  const client = new Client({ connectionString: TEST_DATABASE_URL });
  await client.connect();
  try {
    return await fn(client);
  } finally {
    await client.end();
  }
}

export async function backdateRun(runId: string, msAgo: number) {
  await withDb((db) =>
    // Shift relative to the stored value (columns are UTC `timestamp without time zone`).
    db.query(
      `UPDATE game_runs SET started_at = started_at - ($1::int * interval '1 millisecond') WHERE id = $2`,
      [msAgo, runId],
    ),
  );
}

export const victoryPayload = (
  runToken: string,
  overrides: Record<string, unknown> = {},
) => ({
  runToken,
  outcome: 'victory',
  durationMs: 240_000,
  kills: { infantry: 40, cavalry: 10, archer: 12, commander: 3 },
  bossesDefeated: 0,
  damageTaken: 35,
  perfectBlocks: 8,
  dodges: 14,
  noHitRounds: 0,
  healthRemainingPct: 0.65,
  livesRemaining: 2,
  difficulty: 'knight',
  ...overrides,
});
