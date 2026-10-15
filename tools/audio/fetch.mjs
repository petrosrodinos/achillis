// Downloads every source in sources.mjs into .cache/src/<id>/ and extracts archives in place.
// Downloads are treated as data only: nothing inside them is executed.
// Usage: node fetch.mjs [--force] [id-filter]
import { mkdir, writeFile, stat, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, basename } from 'node:path';
import { execFileSync } from 'node:child_process';
import AdmZip from 'adm-zip';
import sevenBin from '7zip-bin';
import { SOURCES } from './sources.mjs';
import { CACHE_SRC } from './lib/paths.mjs';

const force = process.argv.includes('--force');
const filter = process.argv.slice(2).find((a) => !a.startsWith('--'));

async function download(url, dest) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'white-knight-audio-fetch/1.0' } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      await writeFile(dest, Buffer.from(await res.arrayBuffer()));
      return;
    } catch (e) {
      if (attempt === 3) throw new Error(`${url}: ${e.message}`);
    }
  }
}

function extract(file, dir) {
  if (/\.zip$/i.test(file)) new AdmZip(file).extractAllTo(dir, true);
  else if (/\.7z$/i.test(file)) execFileSync(sevenBin.path7za, ['x', '-y', `-o${dir}`, file], { stdio: 'ignore' });
}

const failures = [];
const queue = SOURCES.filter((s) => !filter || s.id.includes(filter));
const CONCURRENCY = 6;
let i = 0;
async function worker() {
  while (i < queue.length) {
    const src = queue[i++];
    const dir = join(CACHE_SRC, src.id);
    if (!force && existsSync(join(dir, '.done'))) continue;
    await mkdir(dir, { recursive: true });
    try {
      for (const url of src.files) {
        const dest = join(dir, decodeURIComponent(basename(new URL(url).pathname)));
        await download(url, dest);
        extract(dest, dir);
      }
      await writeFile(join(dir, '.done'), new Date().toISOString());
      const n = (await readdir(dir, { recursive: true })).length;
      console.log(`ok   ${src.id} (${n} entries)`);
    } catch (e) {
      failures.push(`${src.id}: ${e.message}`);
      console.log(`FAIL ${src.id}: ${e.message}`);
    }
  }
}
await Promise.all(Array.from({ length: CONCURRENCY }, worker));
if (failures.length) {
  console.error(`\n${failures.length} source(s) failed:\n${failures.join('\n')}`);
  process.exit(1);
}
console.log(`\nAll ${queue.length} sources present in ${CACHE_SRC}`);
