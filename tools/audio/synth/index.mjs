// Generates every project-synthesised source into .cache/synth/ (deterministic).
import { join } from 'node:path';
import { CACHE_SYNTH } from '../lib/paths.mjs';
import { writeWav } from './wav.mjs';
import { beam } from './beam.mjs';

const jobs = {
  'beam-core-1.wav': () => beam({ seconds: 1.6, seed: 7 }),
  'beam-core-2.wav': () => beam({ seconds: 1.2, seed: 21 }),
};

for (const [name, make] of Object.entries(jobs)) {
  writeWav(join(CACHE_SYNTH, name), make());
  console.log(`synth ${name}`);
}
