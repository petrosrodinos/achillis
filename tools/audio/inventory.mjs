// Dev helper: writes .cache/inventory.tsv (path, duration, channels) for all downloaded audio,
// to help choose source files when editing recipes.mjs.
import { readdir, writeFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { CACHE, CACHE_SRC } from './lib/paths.mjs';
import { probe } from './lib/ff.mjs';

const files = (await readdir(CACHE_SRC, { recursive: true }))
  .filter((f) => /\.(wav|ogg|flac|mp3)$/i.test(f) && !/__MACOSX/.test(f))
  .map((f) => join(CACHE_SRC, f));
const rows = [];
let i = 0;
await Promise.all(Array.from({ length: 8 }, async () => {
  while (i < files.length) {
    const f = files[i++];
    try {
      const p = await probe(f);
      rows.push(`${relative(CACHE_SRC, f).replaceAll('\\', '/')}\t${p.duration.toFixed(2)}\t${p.channels}`);
    } catch { rows.push(`${relative(CACHE_SRC, f).replaceAll('\\', '/')}\tERR\t0`); }
  }
}));
rows.sort();
await writeFile(join(CACHE, 'inventory.tsv'), rows.join('\n'));
console.log(`${rows.length} files -> .cache/inventory.tsv`);
