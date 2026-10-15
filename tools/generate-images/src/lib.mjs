// Shared helpers for the White Knight image pipeline.
// The OpenAI key is read ONLY here, from the repo-root `.env.temp`. It is never logged or written anywhere.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const TOOL_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const REPO_ROOT = path.resolve(TOOL_DIR, '..', '..');
export const PROMPTS_DIR = path.join(TOOL_DIR, 'prompts');
export const CACHE_DIR = path.join(TOOL_DIR, '.cache');
export const RAW_DIR = path.join(CACHE_DIR, 'raw');
export const PREVIEW_DIR = path.join(CACHE_DIR, 'previews');
export const IMAGES_DIR = path.join(REPO_ROOT, 'app', 'public', 'assets', 'images');

/** Parse a dotenv-style file without exporting anything to process.env. */
export function readEnvFile(file) {
  const out = {};
  if (!fs.existsSync(file)) return out;
  for (const raw of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const m = line.match(/^(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (!m) continue;
    let v = m[2].trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    else v = v.replace(/\s+#.*$/, '');
    out[m[1]] = v;
  }
  return out;
}

export function getApiKey() {
  const key = readEnvFile(path.join(REPO_ROOT, '.env.temp')).OPENAI_API_KEY;
  if (!key) throw new Error('OPENAI_API_KEY missing from repo-root .env.temp');
  return key;
}

/** Load style.json + all asset prompt files; returns { style, assets[] } with resolved full prompts. */
export function loadAssets() {
  const style = JSON.parse(fs.readFileSync(path.join(PROMPTS_DIR, 'style.json'), 'utf8'));
  const assets = [];
  const walk = (dir) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name.endsWith('.json') && e.name !== 'style.json') {
        const data = JSON.parse(fs.readFileSync(p, 'utf8'));
        for (const a of Array.isArray(data) ? data : [data]) assets.push({ ...a, _file: path.relative(PROMPTS_DIR, p) });
      }
    }
  };
  walk(PROMPTS_DIR);
  const ids = new Set();
  for (const a of assets) {
    if (ids.has(a.id)) throw new Error(`Duplicate asset id ${a.id}`);
    ids.add(a.id);
    const suffix = style.suffixes[a.style ?? 'background'];
    if (suffix === undefined) throw new Error(`Unknown style "${a.style}" for ${a.id}`);
    a.fullPrompt = [a.prompt, suffix].filter(Boolean).join(' ');
  }
  return { style, assets };
}

/** Minimal glob: supports * (no slash), ** (anything), and ? */
export function globToRegExp(glob) {
  let re = '';
  for (let i = 0; i < glob.length; i++) {
    const c = glob[i];
    if (c === '*' && glob[i + 1] === '*') { re += '.*'; i++; }
    else if (c === '*') re += '[^/]*';
    else if (c === '?') re += '.';
    else if (c === ',') re += '|';
    else re += c.replace(/[.+^${}()|[\]\\]/g, '\\$&');
  }
  return new RegExp(`^(?:${re})$`);
}

export function filterAssets(assets, only) {
  if (!only) return assets;
  const res = only.split(',').map((g) => globToRegExp(g.trim()));
  return assets.filter((a) => res.some((r) => r.test(a.id) || r.test(a.outPath)));
}

export const rawPathFor = (a) => path.join(RAW_DIR, `${a.id.replace(/\//g, '__')}.png`);
export const outPathFor = (a) => path.join(IMAGES_DIR, a.outPath);

export function parseArgs(argv) {
  const args = { only: null, force: false, concurrency: 4, dryRun: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--only') args.only = argv[++i];
    else if (a === '--force') args.force = true;
    else if (a === '--dry-run') args.dryRun = true;
    else if (a === '--concurrency') args.concurrency = Number(argv[++i]) || 4;
    else throw new Error(`Unknown argument ${a}`);
  }
  return args;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Call POST /v1/images/generations and return { buffer, usage, model }.
 * Retries 429/5xx/network errors with exponential backoff.
 */
export async function generateImage({ model, prompt, size, quality, background, outputFormat = 'png' }, { retries = 5, log = console.log } = {}) {
  const key = getApiKey();
  const body = { model, prompt, size, quality, n: 1, output_format: outputFormat, moderation: 'low' };
  if (background) body.background = background;
  let attempt = 0;
  for (;;) {
    let res;
    try {
      res = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(300_000),
      });
    } catch (err) {
      if (attempt >= retries) throw err;
      attempt++;
      const wait = 2000 * 2 ** attempt;
      log(`  network error (${err.message}); retry ${attempt}/${retries} in ${wait / 1000}s`);
      await sleep(wait);
      continue;
    }
    if (res.ok) {
      const json = await res.json();
      const b64 = json.data?.[0]?.b64_json;
      if (!b64) throw new Error('No b64_json in response');
      return { buffer: Buffer.from(b64, 'base64'), usage: json.usage ?? null, model };
    }
    const text = await res.text();
    // 429 insufficient_quota (no credits) is not transient — fail fast instead of backing off.
    const retryable = (res.status === 429 && !text.includes('insufficient_quota')) || res.status >= 500;
    if (!retryable || attempt >= retries) {
      const err = new Error(`OpenAI ${res.status}: ${text.slice(0, 500)}`);
      err.status = res.status;
      throw err;
    }
    attempt++;
    const ra = Number(res.headers.get('retry-after'));
    const wait = Number.isFinite(ra) && ra > 0 ? ra * 1000 : 2000 * 2 ** attempt;
    log(`  HTTP ${res.status}; retry ${attempt}/${retries} in ${Math.round(wait / 1000)}s`);
    await sleep(wait);
  }
}
