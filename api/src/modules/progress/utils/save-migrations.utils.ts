import type { Prisma } from 'generated/prisma';
import { CURRENT_SAVE_VERSION } from '../config/save.config';

/**
 * Migration from version N to N+1, keyed by N. Each runs inside a transaction for one user.
 * Example for a future v2: `1: async (tx, userId) => { ...reshape rows...; }`.
 */
export type SaveMigration = (
  tx: Prisma.TransactionClient,
  userId: string,
) => Promise<void>;

export const SAVE_MIGRATIONS: Record<number, SaveMigration> = {};

/** Returns the ordered migrations needed to bring `fromVersion` up to CURRENT_SAVE_VERSION. */
export function pendingMigrations(
  fromVersion: number,
  migrations: Record<number, SaveMigration> = SAVE_MIGRATIONS,
  target: number = CURRENT_SAVE_VERSION,
): SaveMigration[] {
  const steps: SaveMigration[] = [];
  for (let version = fromVersion; version < target; version++) {
    const step = migrations[version];
    if (!step) throw new Error(`Missing save migration from v${version}`);
    steps.push(step);
  }
  return steps;
}
