// Project-generated "beam" core: a sustained arcane energy beam (Mysterious Knight / Wizard).
// Detuned saw cluster with a rising sweep, tremolo shimmer and filtered noise crackle.
// build.mjs layers this with a CC0 fire-ignite recording for the attack transient.
import { SR, rng, lowpass } from './wav.mjs';

export function beam({ seconds = 1.6, seed = 7 } = {}) {
  const n = Math.floor(seconds * SR);
  const out = new Float32Array(n);
  const rand = rng(seed);
  const voices = [110, 110 * 1.007, 165 * 0.996, 220 * 1.004, 330];
  const phases = voices.map(() => 0);
  const noise = new Float32Array(n);
  for (let i = 0; i < n; i++) noise[i] = rand();
  lowpass(noise, 3200);
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const p = t / seconds;
    const env = Math.min(1, t / 0.04) * Math.min(1, (seconds - t) / 0.35); // fast attack, smooth release
    const sweep = 1 + 0.35 * Math.min(1, p * 2.5); // pitch rises while the beam charges
    const trem = 0.75 + 0.25 * Math.sin(2 * Math.PI * 23 * t);
    let s = 0;
    for (let v = 0; v < voices.length; v++) {
      phases[v] = (phases[v] + (voices[v] * sweep) / SR) % 1;
      s += (2 * phases[v] - 1) * (v === 0 ? 0.5 : 0.3);
    }
    const crackle = noise[i] * (0.35 + 0.3 * Math.sin(2 * Math.PI * 7 * t));
    out[i] = (s * 0.5 * trem + crackle) * env;
  }
  return lowpass(out, 5200);
}
