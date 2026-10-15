import { execSync } from 'child_process';
import * as path from 'path';
import { Client } from 'pg';
import { TEST_DATABASE_URL } from './test-env';

/** Applies migrations to the e2e database (`white_knight_test`) and wipes all data. */
export default async function globalSetup() {
  const apiRoot = path.resolve(__dirname, '..');
  execSync('npx prisma migrate deploy', {
    cwd: apiRoot,
    env: { ...process.env, DATABASE_URL: TEST_DATABASE_URL },
    stdio: 'pipe',
  });

  const client = new Client({ connectionString: TEST_DATABASE_URL });
  await client.connect();
  try {
    await client.query('TRUNCATE TABLE users CASCADE');
  } finally {
    await client.end();
  }
}
