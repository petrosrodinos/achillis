import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

export const TOOL_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const REPO_ROOT = resolve(TOOL_DIR, '..', '..');
export const CACHE = join(TOOL_DIR, '.cache');
export const CACHE_SRC = join(CACHE, 'src');
export const CACHE_SYNTH = join(CACHE, 'synth');
export const CACHE_WORK = join(CACHE, 'work');
export const OUT_DIR = join(REPO_ROOT, 'app', 'public', 'assets', 'audio');
