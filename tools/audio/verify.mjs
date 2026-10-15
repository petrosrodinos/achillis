// Verifies app/public/assets/audio against docs/contracts.md §4.3:
// every contract name present in manifest.json, every referenced .ogg + .mp3 exists,
// decodes with non-zero duration, SFX mono / music stereo, sane durations and peaks.
import { readFile, stat, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { OUT_DIR } from './lib/paths.mjs';
import { probe, levels, ffmpeg } from './lib/ff.mjs';

const CONTRACT_SFX = `swing-light swing-heavy hit-flesh hit-armor block block-break parry dodge jump land footstep death grunt
horse-gallop horse-neigh bow-shoot arrow-impact spear-throw magic-cast fireball beam explosion ghost zombie growl bird wind
thunder trap rock-fall wing-flap ui-click ui-hover ui-confirm ui-back victory defeat level-up points horn crowd
footstep-grass footstep-stone footstep-wood footstep-snow armor-clank sword-draw shield-raise whoosh-dodge stun heal
round-bell crowd-cheer crowd-gasp horse-snort horse-hit horse-death mount dismount helmet-off order-move order-hold
order-retreat order-charge select-unit ghost-summon ghost-death zombie-death animal-death troll-roar troll-stomp
witch-laugh wizard-laugh mana-drain terrain-quake tree-rise tree-swipe ship-creak wave-splash water-splash catapult
landing tag-in slide-advance wave-start enemy-alert ui-error ui-toggle ui-type page-turn unlock low-health`.split(/\s+/);
const CONTRACT_MUSIC = 'menu battle duel boss dark flight sea victory story amb-forest amb-wind amb-sea amb-cave amb-storm amb-crowd amb-battle'.split(' ');
const NON_LOOP_MUSIC = new Set(['victory']);

const manifest = JSON.parse(await readFile(join(OUT_DIR, 'manifest.json'), 'utf8'));
const problems = [];
const warn = [];
const rows = [];
const seams = [];
async function rms(file, seekArgs) {
  const err = await ffmpeg([...(seekArgs[0] === '-sseof' ? seekArgs : []), '-i', file, ...(seekArgs[0] === '-t' ? seekArgs : []),
    '-af', 'astats=measure_perchannel=none:measure_overall=RMS_level', '-f', 'null', '-']);
  return Number((err.match(/RMS level dB:\s*(-?[\d.]+)/) || [])[1] ?? -120);
}

for (const n of CONTRACT_SFX) if (!manifest.sfx?.[n]) problems.push(`missing sfx "${n}"`);
for (const n of CONTRACT_MUSIC) if (!manifest.music?.[n]) problems.push(`missing music "${n}"`);
for (const n of Object.keys(manifest.sfx)) if (!CONTRACT_SFX.includes(n)) warn.push(`extra sfx "${n}" not in contract`);
for (const n of Object.keys(manifest.music)) if (!CONTRACT_MUSIC.includes(n)) warn.push(`extra music "${n}" not in contract`);

async function check(rel, kind, name) {
  for (const ext of ['.ogg', '.mp3']) {
    const file = join(OUT_DIR, rel.replace(/\.ogg$/, ext));
    let st;
    try { st = await stat(file); } catch { problems.push(`${rel.replace(/\.ogg$/, ext)} missing`); continue; }
    let p;
    try { p = await probe(file); } catch { problems.push(`${rel.replace(/\.ogg$/, ext)}: not decodable`); continue; }
    if (!(p.duration > 0)) problems.push(`${file}: zero duration`);
    if (kind === 'sfx' && p.channels !== 1) problems.push(`${rel}: expected mono, got ${p.channels}ch`);
    if (kind === 'music' && p.channels !== 2) problems.push(`${rel}: expected stereo, got ${p.channels}ch`);
    if (ext === '.ogg') {
      const { peak } = await levels(file);
      rows.push({ kind, name, file: rel, dur: p.duration, peak, kb: st.size / 1024 });
      if (kind === 'sfx' && (p.duration < 0.05 || p.duration > 4.5)) warn.push(`${rel}: unusual SFX duration ${p.duration.toFixed(2)} s`);
      if (kind === 'music' && (p.duration < 30 || p.duration > 240)) warn.push(`${rel}: music duration ${p.duration.toFixed(1)} s outside 30 s–4 min`);
      if (kind === 'sfx' && (peak > -1.5 || peak < -6)) warn.push(`${rel}: peak ${peak} dBFS (target ≈ -3)`);
      if (kind === 'music' && peak > -0.1) warn.push(`${rel}: decoded peak ${peak} dBFS may clip`);
      if (kind === 'music' && manifest.music[name].loop) {
        // Informational: level of the first/last 300 ms. Crossfaded loops are sample-continuous at the
        // wrap point even when these differ (the tail still carries the fading-out ending).
        const head = await rms(file, ['-t', '0.3']);
        const tail = await rms(file, ['-sseof', '-0.3']);
        seams.push(`${name}: head ${head.toFixed(1)} / tail ${tail.toFixed(1)} dB`);
      }
    }
  }
}

for (const [name, e] of Object.entries(manifest.sfx)) {
  if (!Array.isArray(e.variants) || !e.variants.length) problems.push(`sfx "${name}" has no variants`);
  for (const v of e.variants ?? []) await check(v, 'sfx', name);
}
for (const [name, e] of Object.entries(manifest.music)) {
  if (typeof e.src !== 'string' || typeof e.loop !== 'boolean') problems.push(`music "${name}" malformed`);
  if (e.loop !== !NON_LOOP_MUSIC.has(name)) problems.push(`music "${name}" loop flag should be ${!NON_LOOP_MUSIC.has(name)}`);
  await check(e.src, 'music', name);
}

const sizeOf = async (dir) => {
  let total = 0;
  for (const f of await readdir(join(OUT_DIR, dir))) total += (await stat(join(OUT_DIR, dir, f))).size;
  return total / 1024 / 1024;
};
const verbose = process.argv.includes('--list');
if (verbose) for (const r of rows) console.log(`${r.kind.padEnd(5)} ${r.file.padEnd(34)} ${r.dur.toFixed(2).padStart(7)} s  peak ${String(r.peak).padStart(6)} dBFS  ${r.kb.toFixed(0).padStart(5)} KB`);
if (verbose) console.log(`\nLoop seams (RMS of first/last 300 ms):\n  ${seams.join('\n  ')}`);
const variants = rows.filter((r) => r.kind === 'sfx').length;
console.log(`\nSFX names: ${Object.keys(manifest.sfx).length}/${CONTRACT_SFX.length}, variants: ${variants}; music/ambience: ${Object.keys(manifest.music).length}/${CONTRACT_MUSIC.length}`);
console.log(`Size: sfx ${(await sizeOf('sfx')).toFixed(2)} MB, music ${(await sizeOf('music')).toFixed(2)} MB (ogg+mp3)`);
if (warn.length) console.log(`\nWarnings (${warn.length}):\n  ${warn.join('\n  ')}`);
if (problems.length) {
  console.error(`\nPROBLEMS (${problems.length}):\n  ${problems.join('\n  ')}`);
  process.exit(1);
}
console.log('\nOK — all manifest entries present, decodable and in contract shape.');
