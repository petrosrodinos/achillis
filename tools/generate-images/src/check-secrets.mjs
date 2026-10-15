// npm run check-secrets — fails if the OpenAI key (or its variable name) appears in client sources or build output.
import fs from 'node:fs';
import path from 'node:path';
import { REPO_ROOT, readEnvFile } from './lib.mjs';

const key = readEnvFile(path.join(REPO_ROOT, '.env.temp')).OPENAI_API_KEY;
const needles = ['OPENAI_API_KEY'];
if (key) needles.push(key);
const roots = ['app/src', 'app/public', 'app/dist'].map((r) => path.join(REPO_ROOT, r)).filter((r) => fs.existsSync(r));

const hits = [];
let files = 0;
const walk = (dir) => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { if (e.name !== 'node_modules') walk(p); continue; }
    files++;
    const buf = fs.readFileSync(p);
    for (const n of needles) if (buf.includes(n)) hits.push(`${path.relative(REPO_ROOT, p)} contains ${n === key ? 'the OpenAI key value' : n}`);
  }
};
roots.forEach(walk);
// Vite only exposes VITE_-prefixed vars from app/.env*; make sure nobody re-exports the key that way.
for (const f of fs.readdirSync(path.join(REPO_ROOT, 'app')).filter((f) => f.startsWith('.env'))) {
  const env = readEnvFile(path.join(REPO_ROOT, 'app', f));
  for (const [k, v] of Object.entries(env)) if (k.includes('OPENAI') || (key && v === key)) hits.push(`app/${f} defines ${k}`);
}

if (hits.length) {
  console.error(`SECRET CHECK FAILED:\n  ${hits.join('\n  ')}`);
  process.exit(1);
}
console.log(`check-secrets: OK (${files} files scanned in ${roots.map((r) => path.relative(REPO_ROOT, r)).join(', ')}${key ? '' : '; .env.temp key not found, name-only check'})`);
