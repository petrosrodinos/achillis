/**
 * Server save schema versioning (P8-07). `Profile.save_version` stores the version a user's save was
 * last migrated to. To change the save shape: bump CURRENT_SAVE_VERSION and add a migration for the
 * previous version in `utils/save-migrations.utils.ts`; saves are upgraded lazily on the next progress read.
 */
export const CURRENT_SAVE_VERSION = 1;

/** Run tokens expire after this long; a run must be submitted before it expires. */
export const RUN_TOKEN_TTL_MS = 3 * 60 * 60 * 1000;
