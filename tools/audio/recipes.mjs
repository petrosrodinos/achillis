// What every shipped sound is made of. Names follow docs/contracts.md §4.3 exactly.
//
// Source refs:  '<source-id>'                single-file source (e.g. BigSoundBank 'bsb-0284')
//               '<source-id>:<path-suffix>'  file inside a pack, matched on the end of its path
//                                            without extension (e.g. 'kenney-impact:impactPlate_heavy_000')
//               'synth:<name>'               project-generated file from synth/index.mjs
//
// Variant spec: a ref string, or an object:
//   { src, start?, dur?, seg?, segDb?, pitch?, gain?, rev?, fadeOut?, maxDur?, keepLength?, layers?, at? }
//   seg      pick the n-th non-silent region of the (trimmed) clip; negative counts from the end
//   pitch    varispeed in semitones (changes length too, like tape)
//   gain     dB applied before mixing (layers) — final output is always peak-normalised
//   layers   mix several specs; each layer may set `at` (start offset in seconds)
//   keepLength  skip silence trimming (loops such as the heartbeat)

const L = (src, extra = {}) => ({ src, ...extra });

/** @type {Record<string, any[]>} */
export const SFX = {
  // ---------------- melee ----------------
  'swing-light': ['oga-swishes:swish-3', 'oga-swishes:swish-7', 'oga-swishes:swish-9', 'bsb-0128'],
  'swing-heavy': [L('bsb-1801', { pitch: -2 }), L('bsb-1800', { pitch: -3 }), L('bsb-1797', { pitch: -4 }), L('bsb-1796', { pitch: -2 })],
  'hit-flesh': [
    { layers: [L('bsb-2460'), L('kenney-impact:impactPunch_heavy_001', { gain: -4 })] },
    { layers: [L('bsb-2461'), L('bsb-0127', { gain: -3 })] },
    { layers: [L('bsb-2463'), L('kenney-impact:impactPunch_heavy_003', { gain: -4 })] },
    { layers: [L('bsb-2465'), L('bsb-0127', { gain: -5, pitch: -2 })] },
  ],
  'hit-armor': [
    { layers: [L('kenney-impact:impactPlate_heavy_000'), L('bsb-2459', { gain: -6 })] },
    { layers: [L('kenney-impact:impactPlate_heavy_002'), L('bsb-2460', { gain: -6 })] },
    { layers: [L('kenney-impact:impactPlate_heavy_003'), L('kenney-impact:impactPunch_medium_001', { gain: -5 })] },
    { layers: [L('kenney-impact:impactMetal_heavy_001'), L('bsb-2461', { gain: -6 })] },
  ],
  block: ['oga-shield:impact.2', 'oga-shield:impact.6', 'oga-shield:impact.7', 'oga-shield:impact.8'],
  'block-break': [
    { layers: [L('oga-wood-crack:crack01.mp3', { maxDur: 1.4 }), L('oga-shield:impact.4', { gain: -3 })], maxDur: 1.6 },
    { layers: [L('oga-wood-crack:crack05.mp3', { maxDur: 1.4 }), L('kenney-impact:impactPlate_heavy_004', { gain: -4 })], maxDur: 1.6 },
  ],
  parry: ['oga-swords:sword_clash.2', 'oga-swords:sword_clash.5', 'oga-vehicle-weapons:sword-knife-clash-14', 'oga-vehicle-weapons:sword-knife-clash-20'],
  dodge: [
    { layers: [L('kenney-rpg:cloth1'), L('oga-swishes:swish-12', { gain: -4 })] },
    { layers: [L('kenney-rpg:cloth3'), L('oga-swishes:swish-5', { gain: -4 })] },
  ],
  'whoosh-dodge': [L('bsb-1795'), L('bsb-1796', { pitch: 1 })],
  jump: ['oga-vehicle-weapons:boots-leather-jump-01', 'oga-vehicle-weapons:boots-leather-jump-02', 'oga-vehicle-weapons:boots-leather-jump-03'],
  land: [
    { layers: [L('kenney-impact:impactSoft_heavy_000'), L('kenney-impact:footstep_concrete_001', { gain: -3 })] },
    { layers: [L('kenney-impact:impactSoft_heavy_002'), L('kenney-impact:footstep_grass_001', { gain: -3 })] },
    { layers: [L('kenney-impact:impactSoft_heavy_004'), L('kenney-rpg:footstep05', { gain: -3 })] },
  ],
  death: [
    { layers: [L('oga-vocal-male:slightscream-15'), L('bsb-2452', { at: 0.35, gain: -2 })] },
    { layers: [L('bsb-2361'), L('bsb-2453', { at: 0.3, gain: -2 })] },
    { layers: [L('oga-vocal-male:slightscream-10'), L('bsb-2454', { at: 0.4, gain: -2 })] },
  ],
  grunt: ['oga-vocal-male:slightscream-02', 'oga-vocal-male:slightscream-06', 'oga-vocal-male:slightscream-08', 'oga-vocal-male:slightscream-12'],
  'armor-clank': ['oga-rpg-pack:inventory/chainmail1', 'oga-rpg-pack:inventory/chainmail2', 'oga-rpg-pack:inventory/armor-light', L('bsb-0360', { maxDur: 1.0 })],
  'sword-draw': ['oga-rpg-pack:battle/sword-unsheathe', 'oga-rpg-pack:battle/sword-unsheathe3', 'oga-vehicle-weapons:seax-unsheathe-01'],
  'shield-raise': [
    { layers: [L('kenney-rpg:cloth2'), L('kenney-impact:impactWood_light_001', { at: 0.08, gain: -2 })] },
    { layers: [L('oga-vehicle-weapons:quiver-leather-squeeze-05'), L('kenney-impact:impactPlank_medium_000', { at: 0.06, gain: -4 })] },
  ],
  stun: [L('bsb-2079', { maxDur: 1.6 }), L('bsb-2086', { maxDur: 1.6 })],
  heal: ['oga-cure:Cure2', 'oga-cure:Cure4'],

  // ---------------- movement ----------------
  footstep: ['kenney-rpg:footstep00', 'kenney-rpg:footstep02', 'kenney-rpg:footstep04', 'kenney-rpg:footstep06'],
  'footstep-grass': ['kenney-impact:footstep_grass_000', 'kenney-impact:footstep_grass_001', 'kenney-impact:footstep_grass_002', 'kenney-impact:footstep_grass_003'],
  'footstep-stone': ['kenney-impact:footstep_concrete_000', 'kenney-impact:footstep_concrete_001', 'kenney-impact:footstep_concrete_002', 'kenney-impact:footstep_concrete_003'],
  'footstep-wood': ['kenney-impact:footstep_wood_000', 'kenney-impact:footstep_wood_001', 'kenney-impact:footstep_wood_002', 'kenney-impact:footstep_wood_003'],
  'footstep-snow': ['kenney-impact:footstep_snow_000', 'kenney-impact:footstep_snow_001', 'kenney-impact:footstep_snow_002', 'kenney-impact:footstep_snow_003'],

  // ---------------- horse & mounts ----------------
  'horse-gallop': [L('bsb-0611', { start: 2.0, dur: 2.4, keepLength: true }), L('bsb-0611', { start: 7.0, dur: 2.4, keepLength: true })],
  'horse-neigh': ['bsb-0284', 'bsb-0460', 'bsb-1541'],
  'horse-snort': ['bsb-0286', 'bsb-0285', 'bsb-0287'],
  'horse-hit': [
    { layers: [L('bsb-1542', { dur: 0.9 }), L('bsb-2460', { gain: -3 })] },
    { layers: [L('bsb-0863', { dur: 1.1 }), L('kenney-impact:impactPunch_heavy_002', { gain: -4 })] },
  ],
  'horse-death': [
    { layers: [L('bsb-0863', { pitch: -3 }), L('kenney-impact:impactSoft_heavy_001', { at: 1.6, pitch: -5 }), L('bsb-2452', { at: 1.65, gain: -3 })], maxDur: 3.2 },
    { layers: [L('bsb-1542', { pitch: -4 }), L('kenney-impact:impactSoft_heavy_003', { at: 1.2, pitch: -5 }), L('bsb-2454', { at: 1.25, gain: -3 })], maxDur: 2.8 },
  ],
  mount: [{ layers: [L('oga-vehicle-weapons:quiver-leather-squeeze-06'), L('oga-vehicle-weapons:boots-leather-jump-01', { gain: -4 }), L('bsb-1543', { at: 0.45, gain: -4 })] }],
  dismount: [{ layers: [L('oga-vehicle-weapons:boots-leather-jump-02', { gain: -3 }), L('kenney-impact:impactSoft_medium_000', { at: 0.25 }), L('kenney-rpg:cloth4', { gain: -6 })] }],
  'helmet-off': [
    { layers: [L('kenney-rpg:metalLatch'), L('oga-rpg-pack:inventory/armor-light', { at: 0.12 })] },
    { layers: [L('kenney-rpg:metalPot1', { gain: -3 }), L('oga-rpg-pack:inventory/metal-small2', { at: 0.1 })] },
  ],

  // ---------------- ranged & magic ----------------
  'bow-shoot': [L('bsb-0549', { start: 0, dur: 0.62 }), L('bsb-0549', { start: 0.62 })],
  'arrow-impact': [L('bsb-0548', { start: 0.1, dur: 0.6 }), L('bsb-0548', { start: 1.57, dur: 0.6 }), L('bsb-0548', { start: 3.6, dur: 0.6 })],
  'spear-throw': [
    { layers: [L('bsb-1797', { pitch: -3 }), L('oga-vehicle-weapons:quiver-leather-squeeze-07', { gain: -6 })] },
    { layers: [L('bsb-1798', { pitch: -3 }), L('oga-vocal-male:slightscream-11', { gain: -10 })] },
  ],
  'magic-cast': ['oga-80-rpg:spell_01', 'oga-80-rpg:spell_02', 'oga-rpg-pack:battle/magic1'],
  fireball: ['oga-80-rpg:spell_fire_01', 'oga-80-rpg:spell_fire_03', 'oga-80-rpg:spell_fire_05'],
  beam: [
    { layers: [L('synth:beam-core-1'), L('bsb-1341', { dur: 1.2, gain: -8 }), L('oga-80-rpg:spell_02', { gain: -4 })], maxDur: 1.8 },
    { layers: [L('synth:beam-core-2'), L('oga-80-rpg:spell_fire_06', { gain: -6 })], maxDur: 1.4 },
  ],
  explosion: [{ layers: [L('bsb-1808'), L('oga-bangs:cannon_02', { gain: -2 })] }, 'oga-bangs:cannon_01', 'oga-100-sfx:explosion'],
  'mana-drain': [L('oga-cure:Cure6', { rev: true, pitch: -5 }), L('oga-cure:Cure7', { rev: true, pitch: -4 })],
  'tag-in': [{ layers: [L('bsb-1795', { gain: -2 }), L('oga-80-rpg:spell_02', { at: 0.12 })] }],

  // ---------------- creatures & bosses ----------------
  ghost: ['oga-ghost-moans:wav/qubodup-GhostMoan05', L('oga-rpg-pack:NPC/shade/shade8'), L('bsb-2046', { dur: 2.5, fadeOut: 0.8 })],
  'ghost-summon': [{ layers: [L('bsb-2048', { dur: 2.4, fadeOut: 0.8, gain: -2 }), L('oga-rpg-pack:battle/spell', { maxDur: 2.4 })], maxDur: 2.5 }],
  'ghost-death': [L('oga-rpg-pack:NPC/shade/shade11', { pitch: 2 }), L('oga-ghost-moans:wav/qubodup-GhostMoan01', { dur: 2.0, fadeOut: 0.8, pitch: 3 })],
  zombie: ['bsb-2112', 'bsb-2111', L('bsb-2110', { dur: 2.5, fadeOut: 0.5 })],
  'zombie-death': [
    { layers: [L('oga-80-creature-2:die_03', { pitch: -3 }), L('oga-water:slime_04', { at: 0.3, gain: -6 })] },
    L('bsb-2109', { dur: 2.2, fadeOut: 0.6 }),
  ],
  growl: ['oga-monster-growls:monster.3', 'oga-monster-growls:monster.5', 'oga-bear:flac/bear_01'],
  'animal-death': ['oga-80-rpg:creature_die_01', 'oga-80-creature-2:die_04'],
  'troll-roar': [L('oga-troll:troll-roars', { seg: 0 }), L('oga-troll:troll-roars', { seg: 1 })],
  'troll-stomp': [
    { layers: [L('kenney-impact:impactWood_heavy_000', { pitch: -7 }), L('kenney-impact:impactSoft_heavy_003', { pitch: -3 })] },
    { layers: [L('oga-80-creature-2:stomp_01', { pitch: -4 }), L('kenney-impact:impactSoft_heavy_004', { pitch: -5 })] },
  ],
  'witch-laugh': ['oga-witch-cackle', L('bsb-0489', { seg: 0 }), 'oga-evil-cackle-2'],
  'wizard-laugh': ['oga-evil-laughter', 'oga-evil-laugh:laugh-evil-1', L('bsb-0490', { seg: 0 })],
  'terrain-quake': [{ layers: [L('oga-earthquake', { dur: 2.5, fadeOut: 0.8 }), L('bsb-1022', { start: 3, dur: 2.0, fadeOut: 0.6, gain: -4 })] }],
  'tree-rise': [{ layers: [L('oga-tree-creak', { dur: 2.2, fadeOut: 0.5 }), L('oga-wood-crack:crack02.mp3', { gain: -3, maxDur: 1.5 }), L('bsb-1299', { at: 0.4, dur: 1.5, gain: -6 })], maxDur: 2.4 }],
  'tree-swipe': [
    { layers: [L('bsb-1796', { pitch: -4 }), L('oga-vehicle-tinysized:wood-twigs-break-02', { at: 0.3 })] },
    { layers: [L('bsb-1795', { pitch: -4 }), L('oga-vehicle-tinysized:wood-twigs-break-01', { at: 0.3 })] },
  ],
  bird: ['bsb-3463', 'bsb-3461'],
  'wing-flap': [L('oga-wings-large:wings_flap_large', { seg: 0 }), 'bsb-2891', L('oga-dragon-flap', { seg: 0 })],

  // ---------------- environment ----------------
  wind: [L('bsb-0154', { start: 10, dur: 2.5, fadeOut: 0.8 }), L('oga-wind-loop', { dur: 2.5, fadeOut: 0.8 })],
  thunder: [L('bsb-3113', { maxDur: 4.0 }), L('bsb-3114', { maxDur: 4.0 }), L('bsb-2718', { maxDur: 4.0 })],
  trap: [
    { layers: [L('oga-100-sfx:spring_03'), L('kenney-impact:impactMetal_heavy_000', { at: 0.04 })] },
    { layers: [L('kenney-rpg:metalLatch'), L('kenney-impact:impactMetal_medium_002', { at: 0.05 })] },
  ],
  'rock-fall': ['oga-80-rpg:stones_03', L('bsb-1022', { start: 3, dur: 2.0, fadeOut: 0.6 }), { layers: [L('oga-100-sfx-2:sfx100v2_stones_02'), L('kenney-impact:impactMining_000', { gain: -3 })] }],
  'ship-creak': ['bsb-3421', L('bsb-3426', { start: 5, dur: 2.5, fadeOut: 0.6 }), L('bsb-0306', { dur: 2.5, fadeOut: 0.6 })],
  'wave-splash': [L('bsb-0266', { start: 3, dur: 3.0, fadeOut: 1.0, keepLength: true }), 'bsb-1519'],
  'water-splash': ['oga-water:splash_02', 'oga-water:splash_08', 'oga-splashes:ezwa-water_splash/water_splash-03', 'bsb-1529'],
  catapult: [{ layers: [L('bsb-3421', { dur: 0.6 }), L('kenney-impact:impactWood_heavy_001', { at: 0.5 }), L('bsb-1796', { at: 0.55, pitch: -2 })] }],
  landing: [{ layers: [L('oga-wings-large:wings_flap_large'), L('kenney-impact:impactSoft_heavy_000', { at: 1.4, pitch: -3 }), L('bsb-1543', { at: 1.6, gain: -4 })], maxDur: 2.5 }],

  // ---------------- battle / tournament / orders ----------------
  horn: [L('oga-horn:theircoming3', { maxDur: 3.8, fadeOut: 1.0 }), L('bsb-2524', { maxDur: 3.8, fadeOut: 1.0 })],
  crowd: [L('oga-crowd-shouting', { start: 2, dur: 3.0, fadeOut: 0.8, keepLength: true }), 'bsb-0236'],
  'crowd-cheer': [L('bsb-0237', { maxDur: 3.5, fadeOut: 1.0 }), L('bsb-0021', { start: 0, dur: 3.5, fadeOut: 1.2 })],
  'crowd-gasp': [{
    layers: [
      L('oga-80-creature:ooh'), L('oga-80-creature:ooh', { pitch: -3, at: 0.03, gain: -2 }), L('oga-80-creature:ooh', { pitch: 3, at: 0.05, gain: -3 }),
      L('oga-80-creature:ooh', { pitch: 5, at: 0.02, gain: -4 }), L('oga-80-creature:ooh', { pitch: -5, at: 0.07, gain: -4 }), L('bsb-0019', { dur: 1.0, fadeOut: 0.6, gain: -14 }),
    ],
  }],
  'round-bell': ['bsb-1928', L('bsb-1926', { dur: 2.4, fadeOut: 0.8 })],
  'order-move': [L('bsb-2520')],
  'order-hold': [L('oga-war-drums', { seg: 0, maxDur: 1.5 })],
  'order-retreat': [L('bsb-2522', { pitch: -3 })],
  'order-charge': [{ layers: [L('bsb-2524', { maxDur: 2.2 }), L('oga-crowd-shouting', { start: 2, dur: 2.2, fadeOut: 0.6, gain: -5 })] }],
  'select-unit': ['oga-rpg-pack:inventory/metal-small1', 'oga-rpg-pack:inventory/metal-small3'],
  'wave-start': [L('oga-war-drums', { dur: 2.5, fadeOut: 0.8, keepLength: true })],
  'slide-advance': [{ layers: [L('bsb-1796', { gain: -3 }), L('oga-book-flips:book_flip.4', { at: 0.1, gain: -2 })] }],
  'enemy-alert': ['bsb-0129', 'oga-rpg-pack:battle/sword-unsheathe2'],
  'low-health': [{ layers: [L('bsb-0243'), L('bsb-0244', { at: 0.28, gain: -3 })], pad: 0.86, keepLength: true }],

  // ---------------- UI & progression ----------------
  'ui-click': ['kenney-ui:click1', 'kenney-ui:click3'],
  'ui-hover': ['kenney-ui:rollover2', 'kenney-ui:rollover3'],
  'ui-confirm': ['kenney-interface:confirmation_001', 'kenney-interface:confirmation_002'],
  'ui-back': ['kenney-interface:back_001', 'kenney-interface:back_002'],
  'ui-error': ['kenney-interface:error_004', 'kenney-interface:error_006'],
  'ui-toggle': ['kenney-interface:toggle_001', 'kenney-interface:toggle_002'],
  'ui-type': ['kenney-interface:tick_001', 'kenney-interface:tick_002', 'kenney-interface:tick_004'],
  'page-turn': ['bsb-0362', 'oga-book-flips:book_flip.1', 'bsb-0164'],
  unlock: [{ layers: [L('oga-80-rpg:lock_01'), L('bsb-2086', { at: 0.2, gain: -6, maxDur: 1.4 })] }],
  victory: [L('oga-fanfare', { dur: 3.5, fadeOut: 1.0 })],
  defeat: [L('bsb-1483', { pitch: -4, dur: 3.5, fadeOut: 2.0 })],
  'level-up': [L('oga-joth-ui:Level Up', { maxDur: 2.6 })],
  points: ['oga-80-rpg:item_coins_01', 'oga-80-rpg:item_coins_03'],
};

/**
 * Music + ambience. `xfade` > 0 crossfades the tail into the head so the loop is seamless;
 * 0 = source is already authored as a loop. `lufs` is the integrated loudness target.
 * @type {Record<string, {src:string, start?:number, dur?:number, repeat?:number, loop:boolean, xfade:number, lufs:number, fadeOut?:number}>}
 */
export const MUSIC = {
  menu: { src: 'mus-medieval-theme', loop: true, xfade: 3, lufs: -17 },
  battle: { src: 'mus-medieval-battle', loop: true, xfade: 2, lufs: -16 },
  duel: { src: 'mus-medieval-standoff', repeat: 2, loop: true, xfade: 1.5, lufs: -16 },
  boss: { src: 'mus-determined-pursuit', loop: true, xfade: 0, lufs: -15 },
  dark: { src: 'mus-ancient-mysteries', loop: true, xfade: 0, lufs: -18 },
  flight: { src: 'mus-determined-to-fly', loop: true, xfade: 3, lufs: -16 },
  sea: { src: 'mus-sailors-chant', loop: true, xfade: 0, lufs: -17 },
  victory: { src: 'mus-medieval-victory', loop: false, xfade: 0, lufs: -16, fadeOut: 2.5 },
  story: { src: 'mus-bards-tale', loop: true, xfade: 0, lufs: -18 },
  // Ambience beds (loop under music, quieter targets)
  'amb-forest': { src: 'bsb-0100', loop: true, xfade: 3, lufs: -26 },
  'amb-wind': { src: 'bsb-0595', start: 5, dur: 60, loop: true, xfade: 4, lufs: -26 },
  'amb-sea': { src: 'bsb-0698', start: 10, dur: 60, loop: true, xfade: 4, lufs: -25 },
  'amb-cave': { src: 'oga-dungeon-amb', loop: true, xfade: 0, lufs: -27 },
  'amb-storm': { src: 'bsb-0740', start: 0, dur: 75, loop: true, xfade: 4, lufs: -24 },
  'amb-crowd': { src: 'oga-crowd-shouting', repeat: 2, loop: true, xfade: 3, lufs: -25 },
  'amb-battle': { src: 'mix:battle', loop: true, xfade: 3, lufs: -23 },
};

/**
 * amb-battle is a project mix of CC0 recordings: distant crowd shouting + war drums
 * + scattered sword clashes / impacts. Offsets in seconds within a 40 s bed.
 */
export const BATTLE_BED = {
  length: 40,
  base: [{ src: 'oga-crowd-shouting', gain: -2, loopTo: 40 }, { src: 'oga-war-drums', gain: -9, loopTo: 40 }],
  events: [
    [1.2, 'oga-swords:sword_clash.1'], [3.9, 'oga-swords:sword_clash.3'], [5.1, 'kenney-impact:impactPlate_heavy_001'],
    [8.4, 'oga-swords:sword_clash.6'], [11.0, 'oga-vehicle-weapons:sword-knife-clash-22'], [13.7, 'oga-swords:sword_clash.9'],
    [16.2, 'oga-shield:impact.3'], [18.8, 'oga-swords:sword_clash.4'], [21.5, 'bsb-2524'], [24.9, 'oga-swords:sword_clash.7'],
    [27.3, 'oga-vehicle-weapons:sword-knife-clash-25'], [30.1, 'kenney-impact:impactPlate_heavy_003'], [32.6, 'oga-swords:sword_clash.10'],
    [35.2, 'oga-shield:impact.9'], [37.5, 'oga-swords:sword_clash.8'],
  ],
  eventGain: -14,
};
