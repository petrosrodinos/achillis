import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import ffmpegPath from 'ffmpeg-static';
import ffprobeStatic from 'ffprobe-static';

const run = promisify(execFile);
export const FFMPEG = ffmpegPath;
export const FFPROBE = ffprobeStatic.path;

/** Run ffmpeg with args; returns stderr (ffmpeg logs there). */
export async function ffmpeg(args) {
  const { stderr } = await run(FFMPEG, ['-hide_banner', '-nostdin', ...args], { maxBuffer: 64 * 1024 * 1024 });
  return stderr;
}

/** @returns {Promise<{duration:number, channels:number, sampleRate:number, codec:string}>} */
export async function probe(file) {
  const { stdout } = await run(FFPROBE, ['-v', 'error', '-show_entries', 'format=duration:stream=channels,sample_rate,codec_name', '-of', 'json', file]);
  const j = JSON.parse(stdout);
  const s = j.streams?.[0] ?? {};
  return { duration: Number(j.format?.duration ?? 0), channels: Number(s.channels ?? 0), sampleRate: Number(s.sample_rate ?? 0), codec: s.codec_name ?? '' };
}

/** Peak and RMS level in dBFS via astats. */
export async function levels(file) {
  const err = await ffmpeg(['-i', file, '-af', 'astats=measure_perchannel=none:measure_overall=Peak_level+RMS_level', '-f', 'null', '-']);
  const peak = Number((err.match(/Peak level dB:\s*(-?[\d.]+|-inf)/) || [])[1] ?? NaN);
  const rms = Number((err.match(/RMS level dB:\s*(-?[\d.]+|-inf)/) || [])[1] ?? NaN);
  return { peak, rms };
}

/** Integrated loudness (LUFS) via ebur128. */
export async function loudness(file) {
  const err = await ffmpeg(['-i', file, '-af', 'ebur128=framelog=quiet', '-f', 'null', '-']);
  const m = err.match(/Integrated loudness:\s*I:\s*(-?[\d.]+) LUFS/);
  return m ? Number(m[1]) : NaN;
}

/** Non-silent segments [start,end] (seconds) using silencedetect. */
export async function segments(file, { noiseDb = -40, minSilence = 0.08 } = {}) {
  const { duration } = await probe(file);
  const err = await ffmpeg(['-i', file, '-af', `silencedetect=noise=${noiseDb}dB:d=${minSilence}`, '-f', 'null', '-']);
  const starts = [...err.matchAll(/silence_start: (-?[\d.]+)/g)].map((m) => Math.max(0, Number(m[1])));
  const ends = [...err.matchAll(/silence_end: ([\d.]+)/g)].map((m) => Number(m[1]));
  // Build sound regions as gaps between silences.
  const regions = [];
  let cursor = 0;
  for (let k = 0; k < starts.length; k++) {
    if (starts[k] - cursor > 0.02) regions.push([cursor, starts[k]]);
    cursor = ends[k] ?? duration;
  }
  if (duration - cursor > 0.02) regions.push([cursor, duration]);
  return regions;
}
