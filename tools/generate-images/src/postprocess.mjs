// npm run postprocess -- [--only <glob>]  — re-run post-processing from cached raw downloads (no API calls).
import fs from 'node:fs';
import { loadAssets, filterAssets, parseArgs, rawPathFor, outPathFor } from './lib.mjs';
import { postprocessAsset } from './process.mjs';

const args = parseArgs(process.argv.slice(2));
const assets = filterAssets(loadAssets().assets, args.only);
let ok = 0, missing = 0;
for (const a of assets) {
  const raw = rawPathFor(a);
  if (!fs.existsSync(raw)) { missing++; console.log(`no raw: ${a.id}`); continue; }
  await postprocessAsset(a, raw, outPathFor(a));
  ok++;
}
console.log(`Post-processed ${ok}, missing raw ${missing}.`);
