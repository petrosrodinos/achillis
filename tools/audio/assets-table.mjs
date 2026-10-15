// Prints the markdown rows for the Audio section of /ASSETS.md from sources.mjs + recipes.mjs,
// listing which shipped names use each source. Paste into ASSETS.md (only the Audio section).
import { SOURCES } from './sources.mjs';
import { SFX, MUSIC, BATTLE_BED } from './recipes.mjs';

const usage = new Map(); // source id -> Set of output names
const add = (ref, name) => {
  const id = ref.split(':')[0];
  if (!usage.has(id)) usage.set(id, new Set());
  usage.get(id).add(name);
};
const walk = (spec, name) => {
  if (typeof spec === 'string') return add(spec, name);
  if (spec.src) add(spec.src, name);
  for (const l of spec.layers ?? []) walk(l, name);
};
for (const [name, variants] of Object.entries(SFX)) for (const v of variants) walk(v, `sfx/${name}`);
for (const [name, m] of Object.entries(MUSIC)) add(m.src, `music/${name}`);
for (const b of BATTLE_BED.base) add(b.src, 'music/amb-battle');
for (const [, ref] of BATTLE_BED.events) add(ref, 'music/amb-battle');

const esc = (s) => s.replaceAll('|', '\\|');
const rows = [];
for (const s of SOURCES) {
  const used = [...(usage.get(s.id) ?? [])];
  if (!used.length) continue;
  const notes = s.licence === 'CC0' ? '' : 'Attribution required (credits screen).';
  rows.push(`| ${used.map((u) => `\`${u}\``).join(', ')} | [${esc(s.title)}](${s.page}) | ${esc(s.author)} | ${s.licence} | ${notes} |`);
}
const synthUsers = [...(usage.get('synth') ?? [])];
rows.push(`| ${synthUsers.map((u) => `\`${u}\``).join(', ')} (synth layer) | \`tools/audio/synth/beam.mjs\` | White Knight project (generated offline) | Project-owned | Synthesised energy-beam core, layered with CC0 recordings listed above |`);
rows.push('| `music/amb-battle` (mix) | `tools/audio/recipes.mjs` → `BATTLE_BED` | White Knight project (mix) | Project mix of CC0 sources | Crowd shouting + war drums + sword clashes, all CC0 sources listed above |');
console.log(rows.join('\n'));
