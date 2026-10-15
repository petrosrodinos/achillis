// npm run generate -- [--only <glob[,glob]>] [--force] [--concurrency 4] [--dry-run]
import fs from 'node:fs';
import path from 'node:path';
import pLimit from 'p-limit';
import { loadAssets, filterAssets, parseArgs, rawPathFor, outPathFor, generateImage, CACHE_DIR, RAW_DIR } from './lib.mjs';
import { postprocessAsset } from './process.mjs';

// gpt-image-2 does not support transparent backgrounds (verified: HTTP 400), so transparent assets use gpt-image-1.5.
const MODEL_OPAQUE = 'gpt-image-2';
const MODEL_TRANSPARENT = 'gpt-image-1.5';
// Approximate USD per 1M tokens, used only for the cost estimate printed at the end.
const RATES = {
  'gpt-image-2': { textIn: 5, imageOut: 30 },
  'gpt-image-1.5': { textIn: 5, imageOut: 32 },
};

const modelFor = (a) => a.model ?? (a.background === 'transparent' ? MODEL_TRANSPARENT : MODEL_OPAQUE);

function estimateCost(model, usage) {
  if (!usage) return 0;
  const r = RATES[model] ?? RATES['gpt-image-2'];
  const imgOut = usage.output_tokens_details?.image_tokens ?? usage.output_tokens ?? 0;
  const textOut = usage.output_tokens_details?.text_tokens ?? 0;
  return ((usage.input_tokens ?? 0) * r.textIn + imgOut * r.imageOut + textOut * r.textIn) / 1e6;
}

const args = parseArgs(process.argv.slice(2));
const { assets: all } = loadAssets();
const assets = filterAssets(all, args.only);
fs.mkdirSync(RAW_DIR, { recursive: true });

const todo = assets.filter((a) => args.force || !fs.existsSync(outPathFor(a)));
const byKey = {};
for (const a of todo) {
  const k = `${modelFor(a)} ${a.size} ${a.quality}${a.background === 'transparent' ? ' transparent' : ''}`;
  byKey[k] = (byKey[k] ?? 0) + 1;
}
console.log(`${assets.length} assets matched, ${assets.length - todo.length} already exist (skipped), ${todo.length} to generate.`);
for (const [k, v] of Object.entries(byKey)) console.log(`  ${String(v).padStart(4)} × ${k}`);

if (args.dryRun) {
  for (const a of todo) console.log(`  [dry-run] ${a.id} -> ${a.outPath}`);
  process.exit(0);
}

const limit = pLimit(args.concurrency);
let done = 0, failed = 0, cost = 0;
const usageLog = path.join(CACHE_DIR, 'usage.jsonl');
const failures = [];

await Promise.all(todo.map((a) => limit(async () => {
  const model = modelFor(a);
  const t0 = Date.now();
  try {
    const raw = rawPathFor(a);
    // --force means "new API call"; without --force an existing raw (e.g. from an interrupted run) is reused.
    if (args.force || !fs.existsSync(raw)) {
      const res = await generateImage({ model, prompt: a.fullPrompt, size: a.size, quality: a.quality, background: a.background },
        { log: (m) => console.log(`${a.id}:${m}`) });
      fs.writeFileSync(raw, res.buffer);
      const c = estimateCost(model, res.usage);
      cost += c;
      fs.appendFileSync(usageLog, JSON.stringify({ t: new Date().toISOString(), id: a.id, model, size: a.size, quality: a.quality, usage: res.usage, usd: +c.toFixed(4) }) + '\n');
    }
    await postprocessAsset(a, raw, outPathFor(a));
    done++;
    console.log(`[${done + failed}/${todo.length}] ok   ${a.id} (${model}, ${((Date.now() - t0) / 1000).toFixed(0)}s)`);
  } catch (err) {
    failed++;
    failures.push(a.id);
    console.log(`[${done + failed}/${todo.length}] FAIL ${a.id}: ${err.message}`);
  }
})));

console.log(`\nGenerated ${done}, failed ${failed}. Estimated spend this run: $${cost.toFixed(2)}`);
if (failures.length) { console.log(`Failed: ${failures.join(', ')}`); process.exitCode = 1; }
