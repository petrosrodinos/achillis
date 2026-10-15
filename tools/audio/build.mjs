// Builds app/public/assets/audio/{sfx,music}/*.{ogg,mp3} + manifest.json from recipes.mjs.
// Requires `node fetch.mjs` and `node synth/index.mjs` to have run (cached in .cache/).
// Usage: node build.mjs [--only name1,name2]
import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, relative, extname } from 'node:path';
import { CACHE_SRC, CACHE_SYNTH, CACHE_WORK, OUT_DIR } from './lib/paths.mjs';
import { ffmpeg, probe, levels, loudness, segments } from './lib/ff.mjs';
import { SFX, MUSIC, BATTLE_BED } from './recipes.mjs';

const SR = 44100;
const SFX_PEAK_DB = -3;
const MIN_SFX_SECONDS = 0.3;
// Peak ceiling after loudness matching. -3 dBFS leaves headroom for lossy-codec
// overshoot (Vorbis/MP3 add up to ~2 dB on dense material) so decoded music never clips.
const MUSIC_PEAK_LIMIT = 0.708;
const onlyArg = process.argv.indexOf('--only');
const ONLY = onlyArg > 0 ? new Set(process.argv[onlyArg + 1].split(',')) : null;

// ---------------------------------------------------------------- source resolution
const fileIndex = new Map();
async function filesOf(id) {
  if (!fileIndex.has(id)) {
    const dir = join(CACHE_SRC, id);
    if (!existsSync(dir)) throw new Error(`Source "${id}" not downloaded — run node fetch.mjs`);
    const all = (await readdir(dir, { recursive: true }))
      .filter((f) => /\.(wav|flac|ogg|mp3)$/i.test(f) && !/__MACOSX/i.test(f))
      .map((f) => f.replaceAll('\\', '/'));
    fileIndex.set(id, all);
  }
  return fileIndex.get(id);
}
const FORMAT_RANK = { '.wav': 0, '.flac': 1, '.ogg': 2, '.mp3': 3 };
async function resolveRef(ref) {
  if (ref.startsWith('synth:')) return join(CACHE_SYNTH, `${ref.slice(6)}.wav`);
  const [id, suffix] = ref.split(/:(.*)/s);
  const files = await filesOf(id);
  let hits = suffix
    ? files.filter((f) => {
        const noExt = f.slice(0, -extname(f).length).toLowerCase();
        const s = suffix.toLowerCase();
        return noExt === s || noExt.endsWith(`/${s}`);
      })
    : files.filter((f) => !/preview/i.test(f));
  hits = hits.sort((a, b) => FORMAT_RANK[extname(a).toLowerCase()] - FORMAT_RANK[extname(b).toLowerCase()]);
  if (!hits.length) throw new Error(`No file for ref "${ref}"`);
  const best = hits.filter((h) => extname(h).toLowerCase() === extname(hits[0]).toLowerCase());
  if (best.length > 1) throw new Error(`Ambiguous ref "${ref}": ${best.join(', ')}`);
  return join(CACHE_SRC, id, hits[0]);
}

// ---------------------------------------------------------------- helpers
let tmpCounter = 0;
const tmp = (tag) => join(CACHE_WORK, `${tag}-${++tmpCounter}.wav`);
const dbToLin = (db) => Math.pow(10, db / 20);
const pcm = ['-c:a', 'pcm_f32le', '-ar', String(SR)];

async function duration(file) { return (await probe(file)).duration; }

/** Render one non-layered spec to a mono wav. */
async function renderLeaf(spec, tag) {
  const src = await resolveRef(spec.src);
  const out = tmp(tag);
  const af = ['aresample=' + SR, 'aformat=sample_fmts=flt:channel_layouts=mono'];
  if (spec.start != null || spec.dur != null) af.unshift(`atrim=start=${spec.start ?? 0}${spec.dur != null ? `:duration=${spec.dur}` : ''}`, 'asetpts=PTS-STARTPTS');
  if (spec.rev) af.push('areverse');
  if (spec.pitch) af.push(`asetrate=${Math.round(SR * Math.pow(2, spec.pitch / 12))}`, `aresample=${SR}`);
  await ffmpeg(['-y', '-i', src, '-af', af.join(','), ...pcm, out]);
  let cur = out;
  if (spec.seg != null) {
    const regs = await segments(cur, { noiseDb: spec.segDb ?? -38, minSilence: 0.12 });
    const r = regs.at(spec.seg);
    if (!r) throw new Error(`${spec.src}: segment ${spec.seg} not found (${regs.length} regions)`);
    const seg = tmp(tag);
    const total = await duration(cur);
    const s = Math.max(0, r[0] - 0.01), e = Math.min(total, r[1] + 0.08);
    await ffmpeg(['-y', '-i', cur, '-af', `atrim=start=${s}:end=${e},asetpts=PTS-STARTPTS`, ...pcm, seg]);
    cur = seg;
  }
  return finishShape(cur, spec, tag);
}

/** maxDur / fadeOut applied to a rendered clip. */
async function finishShape(file, spec, tag) {
  if (!spec.maxDur && !spec.fadeOut) return file;
  let d = await duration(file);
  const af = [];
  if (spec.maxDur && d > spec.maxDur) { af.push(`atrim=duration=${spec.maxDur}`); d = spec.maxDur; }
  const f = spec.fadeOut ?? (spec.maxDur ? Math.min(0.4, d * 0.3) : 0);
  if (f > 0) af.push(`afade=t=out:st=${Math.max(0, d - f)}:d=${f}`);
  const out = tmp(tag);
  await ffmpeg(['-y', '-i', file, '-af', af.join(','), ...pcm, out]);
  return out;
}

/** Render any spec (string | leaf | layers) to a mono wav (pre-normalisation). */
async function renderSpec(spec, tag) {
  if (typeof spec === 'string') spec = { src: spec };
  if (!spec.layers) return renderLeaf(spec, tag);
  const parts = [];
  for (const layer of spec.layers) {
    const l = typeof layer === 'string' ? { src: layer } : layer;
    parts.push({ file: await renderSpec(l, tag), at: l.at ?? 0, gain: l.gain ?? 0 });
  }
  const out = tmp(tag);
  const inputs = parts.flatMap((p) => ['-i', p.file]);
  const chains = parts.map((p, k) => `[${k}]adelay=${Math.round(p.at * 1000)}:all=1,volume=${dbToLin(p.gain).toFixed(4)}[l${k}]`);
  const mix = `${parts.map((_, k) => `[l${k}]`).join('')}amix=inputs=${parts.length}:normalize=0:duration=longest[m]`;
  await ffmpeg(['-y', ...inputs, '-filter_complex', `${chains.join(';')};${mix}`, '-map', '[m]', ...pcm, out]);
  return finishShape(out, { maxDur: spec.maxDur, fadeOut: spec.fadeOut }, tag);
}

/** Trim silence, micro-fades, optional pad, peak-normalise to SFX_PEAK_DB. */
async function masterSfx(file, spec, tag) {
  let cur = file;
  if (!spec.keepLength) {
    const t = tmp(tag);
    const rm = 'silenceremove=start_periods=1:start_threshold=-55dB:start_silence=0.005';
    await ffmpeg(['-y', '-i', cur, '-af', `${rm},areverse,${rm},areverse`, ...pcm, t]);
    cur = t;
  }
  const d = await duration(cur);
  const fadeOut = Math.min(0.03, d * 0.2);
  const af = [`afade=t=in:d=0.002`, `afade=t=out:st=${Math.max(0, d - fadeOut)}:d=${fadeOut}`];
  if (spec.pad) af.push(`apad=whole_dur=${spec.pad}`, `atrim=duration=${spec.pad}`);
  // Very short MP3s (a handful of frames) are not reliably detected by some decoders,
  // so pad tiny clicks with trailing silence.
  else if (d < MIN_SFX_SECONDS) af.push(`apad=whole_dur=${MIN_SFX_SECONDS}`);
  const shaped = tmp(tag);
  await ffmpeg(['-y', '-i', cur, '-af', af.join(','), ...pcm, shaped]);
  const { peak } = await levels(shaped);
  const out = tmp(tag);
  await ffmpeg(['-y', '-i', shaped, '-af', `volume=${(SFX_PEAK_DB - peak).toFixed(2)}dB`, ...pcm, out]);
  return out;
}

// Encoder settings per kind: SFX mono ~96 kbps; music stereo ~112 kbps; ambience beds stereo ~64-80 kbps.
const ENCODE = {
  sfx: { ac: 1, vorbisQ: '3', mp3: '96k' },
  music: { ac: 2, vorbisQ: '2', mp3: '112k' },
  ambience: { ac: 2, vorbisQ: '0', mp3: '80k' },
};
async function encode(wav, base, kind) {
  const e = ENCODE[kind];
  const common = ['-y', '-i', wav, '-ac', String(e.ac), '-ar', String(SR), '-map_metadata', '-1'];
  await ffmpeg([...common, '-c:a', 'libvorbis', '-q:a', e.vorbisQ, `${base}.ogg`]);
  await ffmpeg([...common, '-c:a', 'libmp3lame', '-b:a', e.mp3, `${base}.mp3`]);
}

// ---------------------------------------------------------------- music
async function renderBattleBed(tag) {
  const L = BATTLE_BED.length;
  const inputs = [], chains = [];
  let k = 0;
  for (const b of BATTLE_BED.base) {
    inputs.push('-stream_loop', '-1', '-i', await resolveRef(b.src));
    chains.push(`[${k}]aresample=${SR},aformat=channel_layouts=stereo,atrim=duration=${L},volume=${dbToLin(b.gain).toFixed(4)}[b${k}]`);
    k++;
  }
  BATTLE_BED.events.forEach(([at, ref], j) => {
    inputs.push('-i', null); // placeholder, filled below
    chains.push(`[${k}]aresample=${SR},aformat=channel_layouts=stereo,pan=stereo|c0=${(0.5 + 0.4 * Math.sin(j * 2.1)).toFixed(2)}*c0|c1=${(0.5 - 0.4 * Math.sin(j * 2.1)).toFixed(2)}*c1,adelay=${Math.round(at * 1000)}:all=1,volume=${dbToLin(BATTLE_BED.eventGain).toFixed(4)}[b${k}]`);
    k++;
  });
  let ev = 0;
  for (let i = 0; i < inputs.length; i++) {
    if (inputs[i] === null) inputs[i] = await resolveRef(BATTLE_BED.events[ev++][1]);
  }
  const mix = `${Array.from({ length: k }, (_, i) => `[b${i}]`).join('')}amix=inputs=${k}:normalize=0:duration=first,atrim=duration=${L}[m]`;
  const out = tmp(tag);
  await ffmpeg(['-y', ...inputs, '-filter_complex', `${chains.join(';')};${mix}`, '-map', '[m]', ...pcm, out]);
  return out;
}

async function renderMusic(name, m) {
  const tag = `music-${name}`;
  let cur;
  if (m.src === 'mix:battle') cur = await renderBattleBed(tag);
  else {
    const src = await resolveRef(m.src);
    cur = tmp(tag);
    const loopArgs = m.repeat ? ['-stream_loop', String(m.repeat - 1)] : [];
    const af = [`aresample=${SR}`, 'aformat=sample_fmts=flt:channel_layouts=stereo'];
    if (m.start != null || m.dur != null) af.push(`atrim=start=${m.start ?? 0}${m.dur != null ? `:duration=${m.dur}` : ''}`, 'asetpts=PTS-STARTPTS');
    await ffmpeg(['-y', ...loopArgs, '-i', src, '-af', af.join(','), ...pcm, cur]);
  }
  if (m.loop && m.xfade > 0) {
    // Seamless loop: body = T[x:], head = T[0:x]; crossfade body's tail into head.
    // Output ends exactly where the body begins, so playback wraps without a seam.
    const x = m.xfade;
    const out = tmp(tag);
    await ffmpeg(['-y', '-i', cur, '-i', cur, '-filter_complex',
      `[0]atrim=start=${x},asetpts=PTS-STARTPTS[body];[1]atrim=end=${x},asetpts=PTS-STARTPTS[head];[body][head]acrossfade=d=${x}:c1=qsin:c2=qsin[o]`,
      '-map', '[o]', ...pcm, out]);
    cur = out;
  }
  if (!m.loop && m.fadeOut) {
    const d = await duration(cur);
    const out = tmp(tag);
    await ffmpeg(['-y', '-i', cur, '-af', `afade=t=out:st=${d - m.fadeOut}:d=${m.fadeOut}`, ...pcm, out]);
    cur = out;
  }
  // Loudness match then limit peaks.
  const lufs = await loudness(cur);
  const out = tmp(tag);
  await ffmpeg(['-y', '-i', cur, '-af', `volume=${(m.lufs - lufs).toFixed(2)}dB,alimiter=limit=${MUSIC_PEAK_LIMIT}:level=disabled:attack=5:release=80`, ...pcm, out]);
  return out;
}

// ---------------------------------------------------------------- main
await mkdir(CACHE_WORK, { recursive: true });
await mkdir(join(OUT_DIR, 'sfx'), { recursive: true });
await mkdir(join(OUT_DIR, 'music'), { recursive: true });
if (!ONLY) {
  for (const sub of ['sfx', 'music']) for (const f of await readdir(join(OUT_DIR, sub))) await rm(join(OUT_DIR, sub, f));
}

const manifest = { sfx: {}, music: {} };
const errors = [];

const sfxJobs = Object.entries(SFX).filter(([n]) => !ONLY || ONLY.has(n));
let next = 0;
await Promise.all(Array.from({ length: 6 }, async () => {
  while (next < sfxJobs.length) {
    const [name, variants] = sfxJobs[next++];
    try {
      const paths = [];
      for (let v = 0; v < variants.length; v++) {
        const spec = typeof variants[v] === 'string' ? { src: variants[v] } : variants[v];
        const file = variants.length === 1 ? name : `${name}-${v + 1}`;
        const wav = await masterSfx(await renderSpec(spec, `${name}-${v}`), spec, `${name}-${v}`);
        await encode(wav, join(OUT_DIR, 'sfx', file), 'sfx');
        paths.push(`sfx/${file}.ogg`);
      }
      manifest.sfx[name] = { variants: paths };
      console.log(`sfx   ${name} (${paths.length})`);
    } catch (e) {
      errors.push(`${name}: ${e.message.split('\n').slice(-3).join(' ')}`);
      console.log(`FAIL  ${name}: ${e.message.split('\n').slice(-3).join(' ')}`);
    }
  }
}));

for (const [name, m] of Object.entries(MUSIC)) {
  if (ONLY && !ONLY.has(name)) continue;
  try {
    const wav = await renderMusic(name, m);
    await encode(wav, join(OUT_DIR, 'music', name), name.startsWith('amb-') ? 'ambience' : 'music');
    manifest.music[name] = { src: `music/${name}.ogg`, loop: m.loop };
    console.log(`music ${name}`);
  } catch (e) {
    errors.push(`${name}: ${e.message.split('\n').slice(-3).join(' ')}`);
    console.log(`FAIL  ${name}: ${e.message.split('\n').slice(-3).join(' ')}`);
  }
}

{
  // With --only, merge into the existing manifest. Stable key order = recipe order.
  const manifestPath = join(OUT_DIR, 'manifest.json');
  const prev = ONLY && existsSync(manifestPath) ? JSON.parse(await readFile(manifestPath, 'utf8')) : { sfx: {}, music: {} };
  const ordered = { sfx: {}, music: {} };
  for (const n of Object.keys(SFX)) { const e = manifest.sfx[n] ?? prev.sfx[n]; if (e) ordered.sfx[n] = e; }
  for (const n of Object.keys(MUSIC)) { const e = manifest.music[n] ?? prev.music[n]; if (e) ordered.music[n] = e; }
  await writeFile(manifestPath, JSON.stringify(ordered, null, 2) + '\n');
}
await rm(CACHE_WORK, { recursive: true, force: true });

if (errors.length) {
  console.error(`\n${errors.length} failure(s):\n${errors.join('\n')}`);
  process.exit(1);
}
console.log(`\nWrote ${relative(process.cwd(), OUT_DIR)}`);
