// Source of truth for the expanded prompt JSON files in prompts/.
// Edit the definitions below, then run `npm run build-prompts` to rewrite prompts/*.json.
// (The JSON files are committed so every generated image is reviewable/reproducible.)
import fs from 'node:fs';
import path from 'node:path';
import { PROMPTS_DIR } from './lib.mjs';

const WEBP = { op: 'webp', quality: 82, alphaQuality: 90 };

// ---------------------------------------------------------------------------
// Environments (docs/contracts.md §4.2). Each has one lighting/palette line shared by all four layers
// so the layers of one environment match. `interior: true` turns sky into a back wall.
// ---------------------------------------------------------------------------
const ENVS = [
  {
    id: 'forest', missions: 'M1, M3, M8',
    light: 'Warm late-afternoon light, golden-green and earthy olive palette, soft haze',
    sky: 'pale warm sky fading from soft cream-gold near the bottom to muted blue at the top, a few soft drifting cumulus clouds, gentle sun glow',
    far: 'a distant line of rolling forested hills with soft blue-green haze, faint treetop silhouettes',
    mid: 'a dense temperate forest tree line of broad oaks and beeches with layered canopies and visible trunks at the base, mossy undergrowth',
    fore: 'a dark foreground forest-floor edge: ferns, grass tufts, fallen mossy logs, roots and small rocks',
  },
  {
    id: 'forest-clearing', missions: 'M1 open-field battle',
    light: 'Clear bright morning light, fresh green and warm ochre palette, light haze',
    sky: 'soft morning sky, pale blue with warm peach near the bottom, long thin streaks of cloud',
    far: 'distant low wooded ridges in pale blue haze, very gentle and wide',
    mid: 'the edge of a forest around a wide open clearing: scattered oak trees and bushes with gaps of open meadow between them, low grassy rises',
    fore: 'a low foreground edge of tall meadow grass, wildflowers and a few stones',
  },
  {
    id: 'mountains', missions: 'M3, M4',
    light: 'Cool crisp mid-morning light, slate blue, grey stone and muted moss green palette',
    sky: 'high clear alpine sky, cool blue fading to pale grey-white near the bottom, wispy high clouds',
    far: 'a range of tall jagged snow-capped mountain peaks in pale blue haze',
    mid: 'rocky grey mountain slopes and ridges with scattered dark pine trees and a winding pass',
    fore: 'a foreground edge of broken grey rocks, boulders, scree and tough alpine grass tufts',
  },
  {
    id: 'city-gate', missions: 'M3 Cordova (Black Knight boss)',
    light: 'Warm Andalusian dusk light, terracotta, sandstone, ochre and dusty rose palette',
    sky: 'warm dusk sky over southern Spain, apricot and dusty rose near the bottom fading to muted lavender-blue above, thin glowing clouds',
    far: 'the distant skyline of medieval Cordova: sandstone city walls, a great mosque-cathedral with a square minaret tower, domes and flat roofs in warm haze',
    mid: 'the Cordova city gate and a long Roman stone bridge with many arches spanning a river, Moorish horseshoe arches with red-and-cream striped voussoirs, crenellated sandstone walls and towers, a few palm and cypress trees',
    fore: 'a foreground edge of worn sandstone blocks, fallen masonry, dry grass tufts and a broken stone balustrade',
  },
  {
    id: 'coastline', missions: 'M4',
    light: 'Overcast windy afternoon light, cool grey-blue, sea green and sandy beige palette',
    sky: 'overcast coastal sky with layered grey and soft blue clouds, a brighter band of pale light near the horizon',
    far: 'a distant calm grey-blue sea horizon with faint far-off headlands',
    mid: 'rugged coastal cliffs and grassy headlands with crashing surf at their base, a few windswept trees',
    fore: 'a foreground edge of sand dunes with marram grass, driftwood and wet pebbles',
  },
  {
    id: 'dark-tower', missions: 'M4 (Mysterious Knight boss)',
    light: 'Ominous violet twilight, deep indigo, slate grey and faint arcane violet glow palette',
    sky: 'ominous twilight sky with heavy swirling indigo and slate clouds, a faint violet glow behind them, a pale crescent moon',
    far: 'distant jagged dark cliffs and a stormy sea horizon in violet haze',
    mid: 'the exterior of a tall dark wizard tower of black stone on a rocky crag, narrow windows with faint violet light, crooked dead trees and broken walls around its base',
    fore: 'a foreground edge of black rocks, dead thorny bushes and dry dead grass',
  },
  {
    id: 'dark-hallway', missions: 'M5', interior: true,
    light: 'Dim torchlit interior, cold blue-grey stone with warm amber torch glow palette',
    sky: 'the dark back wall of a long castle corridor: rough grey stone blocks, faint mould, unlit shadows, fading into darkness at the top, a few hanging cobwebs',
    far: 'a distant row of dark stone archways receding into the corridor, faint blue darkness inside them',
    mid: 'a row of thick stone pillars with iron wall torches casting warm amber glow, old tattered tapestries and a closed iron-studded door',
    fore: 'a foreground edge of broken flagstones, rubble, scattered bones, a toppled candelabra and cobwebs',
  },
  {
    id: 'mirror-hall', missions: 'M5 Shadow Mirror Hall', interior: true,
    light: 'Eerie cold interior, dark slate, tarnished silver and arcane violet glow palette',
    sky: 'the back wall of a tall shadowy hall: dark panelled stone with faint violet mist drifting near the floor and darkness above',
    far: 'distant tall gothic arches with dim violet light',
    mid: 'a row of tall ornate standing mirrors in tarnished silver frames, their glass dark and smoky with faint violet reflections, separated by dark stone columns',
    fore: 'a foreground edge of shattered mirror shards, dark broken floor tiles and wisps of violet mist',
  },
  {
    id: 'grand-hall', missions: 'M5 (Wizard boss)', interior: true,
    light: 'Grand dim interior lit by candles and arcane glow, deep burgundy, aged gold and violet palette',
    sky: 'the back wall of an immense vaulted great hall: dark stone ribbed vaults, tall stained-glass windows glowing faint violet, darkness at the top',
    far: 'a distant colonnade of tall stone columns and pointed arches in hazy shadow',
    mid: 'heavy stone pillars hung with tattered burgundy banners, iron chandeliers with candles, a raised dais with a dark throne, stone stairs',
    fore: 'a foreground edge of a cracked marble floor edge, a toppled brass brazier, scattered books and a fallen banner',
  },
  {
    id: 'tower-coast', missions: 'M6 start',
    light: 'Cold pale dawn after a storm, steel blue, grey-violet and pale gold palette',
    sky: 'a cold pale dawn sky, steel-blue clouds breaking apart with pale gold light on the horizon',
    far: 'a distant dark wizard tower on a cliff behind grey sea mist, far away on the horizon',
    mid: 'a rocky dark shoreline with a small old stone jetty, wooden posts and moored small boats, black cliffs',
    fore: 'a foreground edge of wet black rocks, seaweed, kelp and foamy tide pools',
  },
  {
    id: 'open-sea', missions: 'M6',
    light: 'Bright but windy overcast day at sea, deep teal, grey-blue and white foam palette',
    sky: 'a wide sea sky with large rolling grey and white clouds, patches of muted blue, sunlight beams breaking through',
    far: 'the open sea horizon line with distant medieval sailing ships (cogs with square sails) small and hazy along it, very calm and wide',
    mid: 'a band of large rolling deep teal ocean waves with white crests, spanning the full width',
    fore: 'a foreground band of big foamy cresting waves and sea spray',
  },
  {
    id: 'european-coast', missions: 'M6 (Paladin duel)',
    light: 'Warm golden sunset light, warm green, honey gold and soft blue palette',
    sky: 'a warm sunset sky, honey gold and peach near the horizon, soft lilac and blue clouds above',
    far: 'a calm sea horizon with a distant green headland and a small castle on it',
    mid: 'green coastal hills meeting a sandy beach, a small fishing village with stone houses and a lighthouse, a few trees',
    fore: 'a foreground edge of beach sand, sea grass tufts, rocks and a beached rowboat',
  },
  {
    id: 'tournament', missions: 'M7 Training Grounds',
    light: 'Bright festive midday light, warm cream, faded red, faded blue and straw palette',
    sky: 'a bright clear sky, soft blue with puffy white clouds',
    far: 'distant green hills with a castle on top and small banners',
    mid: 'medieval tournament grounds: colourful striped pavilion tents in faded red, blue and cream, wooden spectator stands draped with cloth, tall poles with pennants, a wooden tilt barrier',
    fore: 'a foreground edge of trampled straw, hay bales, a weapon rack and wooden fence posts',
  },
  {
    id: 'lake', missions: 'M8',
    light: 'Soft misty early morning, pale silver-blue, sage green and lavender palette',
    sky: 'a soft misty morning sky, pale silver and lavender gradient with faint thin clouds',
    far: 'distant forested hills reflected across a still misty lake surface',
    mid: 'the green shore of a calm lake: a row of weeping willow trees and alder bushes, reeds and rushes, a small wooden pier on posts; solid opaque painted shapes with no mist, no fog and no clouds',
    fore: 'a foreground edge of tall reeds, cattails, lily pads at the water edge and wet stones',
  },
  {
    id: 'stone-circle', missions: 'M8 Ancient Stone Grounds (Witch Spirit boss)',
    light: 'Eerie green-tinted dusk, dark moor green, grey stone and faint spectral green glow palette',
    sky: 'an eerie dusk sky, murky green-grey clouds with a pale sickly green glow near the horizon, a few early stars',
    far: 'distant dark moorland hills under low fog',
    mid: 'an ancient circle of tall weathered standing stones and stone lintels on a grassy moor, carved runes faintly glowing green, crooked bare trees',
    fore: 'a foreground edge of heather, dry grass, small mossy stones and a fallen carved stone',
  },
  {
    id: 'sky-continental', missions: 'M9, M11 (Hippogryph flight)',
    light: 'Bright high-altitude daylight, clear sky blue, white cloud and patchwork green-gold palette',
    sky: 'a wide high-altitude clear blue sky with big sunlit cumulus clouds',
    far: 'a patchwork European countryside far below seen from high in the air, fields, rivers and forests in blue haze, at the very bottom',
    mid: 'a band of large fluffy white cumulus cloud banks drifting at flight height',
    fore: 'a foreground band of soft white cloud puffs and wisps',
  },
  {
    id: 'storm-zone', missions: 'M9, M11 (storms)',
    light: 'Dark stormy light, charcoal, bruised blue-grey and cold white lightning palette',
    sky: 'a dark storm sky with towering black and slate-blue thunderclouds, bright forked lightning bolts, rain streaks',
    far: 'distant dark storm cloud masses with rain curtains falling from them',
    mid: 'a band of heavy churning dark grey storm clouds with faint lightning glow inside',
    fore: 'a foreground band of torn dark cloud wisps and driving rain',
  },
  {
    id: 'fortress-airspace', missions: 'M9 (approach to the fortress)',
    light: 'Hazy smoky sunset, burnt orange, dark iron grey and dusty red palette',
    sky: 'a hazy smoky sunset sky, burnt orange near the bottom fading to dusty grey-purple, drifting smoke',
    far: 'a distant dark enemy fortress on a high crag with many towers, thin dark grey smoke trails drifting from its towers, seen from the air',
    mid: 'a band of smoky orange-tinted clouds and dark crags with watchtowers poking through',
    fore: 'a foreground band of dark smoke and ragged cloud wisps',
  },
  {
    id: 'fortress-walls', missions: 'M10',
    light: 'Cold moonlit night with torches, deep navy, cold grey stone and warm torch orange palette',
    sky: 'a cold night sky, deep navy with a large pale full moon and thin silver clouds, scattered stars',
    far: 'distant fortress towers and rooftops silhouetted against the night',
    mid: 'massive fortress battlements and crenellated stone walls with towers, burning torches on the walls, banners',
    fore: 'a foreground edge of crenellation stones, wooden crates, a barrel and a rack of spears',
  },
  {
    id: 'fortress-halls', missions: 'M10', interior: true,
    light: 'Torchlit fortress interior, warm grey stone, iron and faded red cloth palette',
    sky: 'the back wall of a fortress hallway: large grey stone blocks, iron-banded wooden beams across the top, darkness above',
    far: 'distant stone archways and a staircase receding in dim light',
    mid: 'stone pillars with burning wall torches, faded red heraldic banners, suits of armour on stands, weapon racks',
    fore: 'a foreground edge of flagstones, a toppled wooden bench, a barrel and scattered straw',
  },
  {
    id: 'fortress-dungeon', missions: 'M10 (Bewitched Ally, Evil Witch)', interior: true,
    light: 'Dark torchlit dungeon with a sickly witch glow, black stone, rust and spectral green palette',
    sky: 'the back wall of a dark damp dungeon: rough wet black stone, dripping water stains, rusty chains hanging, darkness above',
    far: 'distant dungeon cell arches with rusty iron bars, faint green glow behind them',
    mid: 'thick stone pillars, burning torches in iron brackets, hanging chains and shackles, a bubbling cauldron with faint spectral green glow',
    fore: 'a foreground edge of wet broken flagstones, scattered straw, bones, a rusty bucket and puddles',
  },
  {
    id: 'ocean-sky', missions: 'M11 (flight above the ocean)',
    light: 'Bright morning over the ocean, aqua, deep blue and warm white palette',
    sky: 'a bright morning sky above the ocean, warm white near the horizon to clear blue at the top, scattered small clouds',
    far: 'the vast open ocean far below, deep blue with sun glitter, seen from high in the air, at the very bottom',
    mid: 'a band of scattered white cumulus clouds at flight height',
    fore: 'a foreground band of soft white cloud wisps',
  },
  {
    id: 'swamp-coast', missions: 'M11 landing (Swamp Troll boss)',
    light: 'Humid murky afternoon, swamp olive, muddy brown and grey-green palette with fog',
    sky: 'a humid murky sky, pale grey-green and dull yellow haze with low clouds',
    far: 'a distant murky coastline with low hills and grey-green fog',
    mid: 'a swamp coast with twisted mangrove-like trees, hanging moss, stagnant water pools, dead stumps and reeds',
    fore: 'a foreground edge of dark mud, swamp reeds, mossy roots, brown toadstools and a rotten log; no animals, no creatures, no figures',
  },
  {
    id: 'mercenary-field', missions: 'M12 open-field battle',
    light: 'Overcast grey afternoon, muted olive, dull ochre and slate grey palette',
    sky: 'an overcast grey afternoon sky with heavy layered clouds and a dull sun glow',
    far: 'distant low hills with a walled town and smoke columns rising',
    mid: 'a wide open plain with a war camp: canvas tents, wooden palisade stakes, banners on poles, a few lone trees',
    fore: 'a foreground edge of trampled grass, mud, broken wooden stakes and a fallen shield',
  },
  {
    id: 'imperial-arena', missions: 'M13 Emperor\'s Champion',
    light: 'Grand warm afternoon light, sandstone, deep imperial purple and gold palette',
    sky: 'a warm afternoon sky, warm cream-gold near the bottom to soft blue at the top, few clouds',
    far: 'the distant domes and towers of an imperial capital in warm haze',
    mid: 'a grand stone imperial arena: tiered stone stands with arches, deep purple and gold imperial banners and canopies, a central imperial box',
    fore: 'a foreground edge of a low stone arena wall, sand, a weapon rack and purple cloth drapes',
  },
  {
    id: 'balkan-forest', missions: 'M14',
    light: 'Autumn afternoon light, rust orange, deep green and earthy brown palette',
    sky: 'an autumn afternoon sky, soft blue with warm gold clouds',
    far: 'distant rolling forested Balkan hills in autumn colours and blue haze',
    mid: 'a dense Balkan forest of beech and dark pine trees in autumn, rust and orange leaves, a small wooden shrine',
    fore: 'a foreground edge of fallen autumn leaves, ferns, mossy rocks and roots',
  },
  {
    id: 'valachia-mountains', missions: 'M14',
    light: 'Cold clear afternoon, icy blue, white snow, dark pine green and grey stone palette',
    sky: 'a cold clear sky, icy pale blue with high thin clouds',
    far: 'the distant snowy Carpathian peaks of Wallachia with a dark castle on a high ridge',
    mid: 'snowy mountain slopes with dark fir forests, rocky outcrops and a narrow pass',
    fore: 'a foreground edge of snow drifts, snow-covered rocks and frosted dry grass',
  },
  {
    id: 'german-fields', missions: 'M14',
    light: 'Warm summer afternoon, wheat gold, fresh green and warm sky blue palette',
    sky: 'a warm summer sky, clear blue with big soft white clouds',
    far: 'distant gentle green hills with a church spire and forests',
    mid: 'rolling golden wheat fields with hedgerows, a small half-timbered village and a windmill, lines of poplar trees',
    fore: 'a foreground edge of tall wheat stalks, poppies, cornflowers and a wooden fence',
  },
  {
    id: 'wedding-courtyard', missions: 'M15 (final duel at the wedding)',
    light: 'Festive warm late-afternoon light, warm cream stone, rose, gold and leaf green palette',
    sky: 'a festive warm late-afternoon sky, soft gold and pink near the bottom to clear blue above, light clouds',
    far: 'the tall towers of a ducal castle with long festive banners flying',
    mid: 'a castle courtyard decorated for a wedding: cream stone arcades, garlands of flowers, colourful pennant strings, banquet tables with white cloth, a stone fountain',
    fore: 'a foreground edge of courtyard cobblestones, scattered flower petals, potted flowers and a wooden barrel',
  },
];

// `share` is what we ask the model for; `top` is where post-processing places the band's top edge
// (fraction of the 2048x1024 output), matching contracts §4.2 (far: lower half, mid: lower 60%, fore: lower ~35%).
const LAYER_SPEC = {
  far: { share: 'the bottom 40%', values: 'light, low contrast and desaturated by atmospheric perspective, but with a crisp clean silhouette top edge directly against the transparency (no mist, haze or glow band above the silhouette)', top: 0.44 },
  mid: { share: 'the bottom 45%', values: 'medium values and medium contrast, with a clean silhouette top edge directly against the transparency', top: 0.57 },
  fore: { share: 'only the bottom 22%', values: 'darker values, richer colour, crisp edges', top: 0.72 },
};

function envAssets(env) {
  const assets = [];
  const base = `env/${env.id}`;
  const skyIntro = env.interior
    ? `Side-scrolling game parallax BACKGROUND WALL layer for an interior scene, wide panorama. ${env.light}. ${env.sky}. Fills the whole image edge to edge.`
    : `Side-scrolling game parallax SKY layer only, wide 2:1 panorama. ${env.light}. ${env.sky}. Only sky fills the image: no ground, no hills, no mountains, no trees, no buildings, no horizon objects.`;
  assets.push({
    id: `${base}/sky`, outPath: `${base}/sky.webp`, style: 'background',
    prompt: `${skyIntro} Evenly distributed composition with nothing important at the left or right edges so it can tile horizontally.`,
    size: '2048x1024', quality: 'medium', background: 'opaque',
    postprocess: [{ op: 'seamless', axes: 'x', width: 2048, height: 1024, blend: 0.18, position: 'centre' }, WEBP],
  });
  for (const layer of ['far', 'mid', 'fore']) {
    const spec = LAYER_SPEC[layer];
    assets.push({
      id: `${base}/${layer}`, outPath: `${base}/${layer}.webp`, style: 'background',
      prompt: `Side-scrolling game parallax ${layer.toUpperCase()} layer on a fully transparent background. ${env.light}. The layer contains only: ${env[layer]}, drawn as one continuous band running across the entire width from the left edge to the right edge, occupying ${spec.share} of the image and extending solidly down to the bottom edge with no gap. ${spec.values}. Everything above the band is completely empty and transparent: no sky, no clouds, no sun, no background colour.`,
      size: '1536x1024', quality: 'medium', background: 'transparent',
      postprocess: [
        { op: 'alphaClean', threshold: 12 },
        { op: 'anchorBottom', coverage: 0.6, bleed: 0.06 },
        { op: 'seamless', axes: 'x', width: 2048, height: 1024, blend: 0.18, position: 'bottom' },
        { op: 'placeTop', top: spec.top, coverage: 0.08, allowUp: layer !== 'fore' },
        { op: 'topFade', clear: Math.max(0.04, +(spec.top - 0.34).toFixed(2)), fade: 0.06 },
        WEBP,
      ],
    });
  }
  return assets.map((a) => ({ ...a, notes: `Environment ${env.id} (${env.missions})` }));
}

// Fog: generated opaque (white mist on black) with gpt-image-2, then luminance → alpha with a tint colour.
const FOG = [
  { id: 'light', color: '#efe6d6', gain: 1.0, desc: 'soft pale wispy horizontal mist bands, gentle and thin, with gaps' },
  { id: 'dark', color: '#4a4458', gain: 1.25, desc: 'thick heavy rolling horizontal fog bands, dense near the bottom' },
  { id: 'storm', color: '#8a93a3', gain: 1.15, desc: 'torn windswept horizontal storm mist streaks and rain-laden cloud wisps' },
];
const fogAssets = FOG.map((f) => ({
  id: `env/_fog/${f.id}`, outPath: `env/_fog/${f.id}.webp`, style: 'raw',
  prompt: `Pure white ${f.desc} painted on a solid pure black background, soft painterly edges, the mist sits mostly in the middle and lower part of the image and fades out completely towards the top, evenly spread across the full width with nothing at the left or right edges standing out, grayscale only, no objects, no landscape, no text.`,
  size: '2048x1024', quality: 'medium', background: 'opaque',
  postprocess: [
    { op: 'seamless', axes: 'x', width: 2048, height: 1024, blend: 0.2, position: 'centre' },
    { op: 'lumaToAlpha', color: f.color, gain: f.gain },
    { op: 'topFade', clear: 0.08, fade: 0.2 },
    WEBP,
  ],
  notes: 'Shared fog layer (luma-keyed to alpha)',
}));

// Ground textures: 1024 seamless both axes.
const GROUND = {
  dirt: 'packed brown earth dirt road surface with small pebbles, faint cart tracks and subtle cracks',
  grass: 'short trimmed green-olive grass turf with a few tiny clover leaves and small earth patches',
  sand: 'fine warm beige sand with soft wind ripples and a few tiny shells',
  stone: 'grey cobblestone paving of rounded irregular stones with dark mortar gaps',
  snow: 'packed white snow surface with soft blue shadows, footprints-free, faint ice crystals',
  wood: 'weathered warm brown wooden floor planks running horizontally with nails and grain',
  marble: 'polished cream and grey veined marble floor tiles in a simple square grid',
};
const groundAssets = Object.entries(GROUND).map(([k, desc]) => ({
  id: `ground/${k}`, outPath: `ground/${k}.webp`, style: 'texture',
  prompt: `Seamless tileable top-down ground texture: ${desc}. Fills the entire square edge to edge with an even, repeating pattern.`,
  size: '1024x1024', quality: 'medium', background: 'opaque',
  postprocess: [{ op: 'seamless', axes: 'xy', width: 1024, height: 1024, blend: 0.2, position: 'centre' }, WEBP],
  notes: 'Ground texture',
}));

// ---------------------------------------------------------------------------
// Characters (docs/art-bible.md)
// ---------------------------------------------------------------------------
const WK = 'the White Knight, a heroic knight in gleaming white-silver plate armour with a closed great helm topped by a white plume, a pale blue tabard with a gold cross, a large kite shield with a gold cross on pale blue, an oversized longsword';
const BK = 'the Black Knight, a menacing knight in black plate armour with oxblood-red trim and a black horned helm, heater shield, oversized sword';
const MK = 'the Mysterious Knight, a knight in dark violet-grey plate armour with a hooded great helm and faint glowing violet accents';
const BRK = 'the Bronze Knight "Brown Feather", a knight in bronze-brown plate armour with a nasal helm and one tall brown feather';
const GC = 'Green Chestnut, a Saracen lieutenant in a green robe over chainmail with a chestnut-brown turban, round shield and scimitar';

const PORTRAITS = {
  'white-knight': 'A heroic knight in gleaming white-silver plate armour, closed great helm with a narrow eye slit and a tall white plume, pale blue tabard with a gold cross on the chest, gold trim.',
  'bronze-knight': 'The Bronze Knight "Brown Feather": a knight in bronze-brown plate armour, an open nasal helm showing a determined bearded face, one tall brown feather rising from the helm, tan leather straps.',
  'mysterious-knight': 'The Mysterious Knight: dark violet-grey plate armour, a deep dark hood drawn over a closed great helm, faint glowing arcane violet accents in the eye slit and armour seams, mysterious and calm.',
  'green-chestnut': 'Green Chestnut, a Saracen lieutenant: a bearded warrior with a chestnut-brown turban, olive-green robe over chainmail, a round shield edge visible at the shoulder, confident expression.',
  'black-knight': 'The Black Knight, the villain: black plate armour with oxblood-red trim, a black horned great helm with a narrow menacing eye slit, dark and imposing.',
  'saracen-leader-1': 'A Saracen leader: a proud commander with a white turban, crimson and gold robes over chainmail, gold embroidery, a short dark beard.',
  'saracen-leader-2': 'A Saracen leader: a stern warrior in indigo and silver robes over chainmail, a pointed spiked steel helm with a chainmail aventail covering the neck, a dark beard.',
  'pink-paladin': 'A tournament paladin in polished steel plate armour, closed great helm with a plume, dusty rose tabard with cream trim.',
  'red-paladin': 'A tournament paladin in polished steel plate armour, closed great helm with a plume, brick red tabard with straw-gold trim.',
  'blue-paladin': 'Oliver the Blue Paladin: polished steel plate armour, closed great helm with a plume, steel blue tabard with silver trim.',
  'deer-paladin': 'Renault the Deer Paladin: polished steel plate armour, closed great helm crowned with a pair of deer antlers, tan-brown tabard with dark brown trim.',
  'orange-paladin': 'A tournament paladin in polished steel plate armour, closed great helm with a plume, burnt orange tabard with dark charcoal trim.',
  'yellow-paladin': 'A tournament paladin in polished steel plate armour, closed great helm with a plume, ochre yellow tabard with dark brown trim.',
  'emperor-knight': 'The Emperor Knight: ornate gold-plated armour with deep imperial purple cloth, a great helm encircled by a golden crown with a plume, a purple cape with gold embroidery, majestic.',
};
const portraitAssets = Object.entries(PORTRAITS).map(([id, desc]) => ({
  id: `portraits/${id}`, outPath: `portraits/${id}.webp`, style: 'portrait',
  prompt: `Bust portrait of a single character. ${desc}`,
  size: '1024x1024', quality: 'high', background: 'opaque',
  postprocess: [{ op: 'fit', width: 768, height: 768, position: 'centre' }, WEBP],
  notes: 'Character portrait',
}));

const MISSIONS = {
  m01: `A large medieval battle at the edge of a forest: ${WK} on a white warhorse leads the kingdom's army of footsoldiers and cavalry with blue banners against an enemy army with dark green banners, archers in the background, dust and morning light through the trees.`,
  m02: `Single combat after the battle: ${WK} on a white warhorse faces the defeated enemy commander in dark green and iron armour with a nasal helm on a brown warhorse, both with raised swords, a ring of soldiers watching at a distance in a trampled forest clearing.`,
  m03: `${WK} on foot at the stone bridge before the Moorish city gate of Cordova at dusk, facing ${BK} mounted on a black warhorse, horseshoe arches with striped voussoirs and sandstone towers behind them, arrows in the air.`,
  m04: `${WK} on a mountain coast path confronting ${MK} mounted on a dark horse and casting violet magic beams, a tall dark wizard tower on a crag under a stormy violet twilight sky.`,
  m05: `${WK} inside a vast dark vaulted hall of shadowy mirrors, translucent spectral green ghosts and shambling grey-green zombies emerging from the mirrors, a tall robed wizard with a pointed hat and a glowing staff on a dais in the background, violet arcane light.`,
  m06: `${MK} standing on the deck of a medieval cog sailing ship on a rough teal sea, sword drawn, enemy ships with archers nearby, storm clouds and wind-filled sails, a distant green European coast on the horizon.`,
  m07: `A medieval tournament ground on a sunny day: two armoured paladins, one in a brick red tabard and one in a steel blue tabard, jousting on horseback with lances, colourful striped pavilions, wooden stands with spectators and fluttering pennants.`,
  m08: `${WK} arriving at an ancient circle of standing stones on a misty moor at dusk, a translucent green witch spirit with a tattered hat and staff hovering among the stones casting spectral green magic, a small glowing sacred herb at the centre.`,
  m09: `${WK} riding a hippogryph (eagle front, horse hind, large wings) high in a stormy sky with lightning, flying towards a dark enemy fortress on a crag in the distance, birds and wind streaks.`,
  m10: `${WK} in a torchlit fortress dungeon facing ${BRK}, who is bewitched with a sickly green glow in his eyes, while an evil witch with a pointed hat and staff laughs behind him beside a bubbling cauldron.`,
  m11: `${GC} standing on a murky swamp coast protecting a frightened young lady in a simple dress behind him, facing a huge hunched mossy green-brown swamp troll with a giant wooden club, a hippogryph waiting nearby, fog and twisted trees.`,
  m12: `A mercenary battle on a wide overcast plain: a lone paladin in slate grey armour without a crest, fighting for a neighbouring kingdom, charges with infantry and cavalry under foreign banners, a war camp and smoke in the background.`,
  m13: `A grand imperial arena: a knight disguised as the Emperor in purple and gold armour with a crowned great helm faces ${WK} on horseback across the sand, tiered stands with purple and gold imperial banners and crowds.`,
  m14: `${WK} and ${GC} travelling on horseback along a winding road from autumn Balkan forests towards snowy Wallachian mountains, golden German wheat fields and a distant ducal castle visible ahead on the horizon.`,
  m15: `A wedding in a sunlit castle courtyard decorated with garlands and pennants, interrupted: ${BK} on a black warhorse charges in, ${WK} draws his sword to defend the wedding party, guests fleeing, banquet tables overturned.`,
};
const missionAssets = Object.entries(MISSIONS).map(([id, desc]) => ({
  id: `missions/${id}`, outPath: `missions/${id}.webp`, style: 'illustration',
  prompt: `Story illustration, wide landscape composition. ${desc}`,
  size: '1536x1024', quality: 'high', background: 'opaque',
  postprocess: [{ op: 'fit', width: 1536, height: 1024, position: 'centre' }, WEBP],
  notes: 'Mission illustration',
}));

const uiAssets = [
  {
    id: 'ui/title', outPath: 'ui/title.webp', style: 'keyart',
    prompt: `Title screen key art, wide 16:9: ${WK}, mounted on a powerful white warhorse with a pale blue and gold caparison, rearing on a hill at golden sunset, sword raised, cape flowing, a vast medieval landscape with distant castles and mountains behind. The knight is placed slightly right of centre; the left third of the image is calmer sky and landscape with space for a title.`,
    size: '1920x1088', quality: 'high', background: 'opaque',
    postprocess: [{ op: 'fit', width: 1920, height: 1080, position: 'centre' }, WEBP],
    notes: 'Title key art',
  },
  {
    id: 'ui/menu', outPath: 'ui/menu.webp', style: 'background',
    prompt: 'Calm main-menu backdrop, wide 16:9: a quiet medieval castle courtyard at dusk seen from a balcony, a knight\'s white-plumed great helm, a kite shield with a gold cross on pale blue and a longsword resting on a wooden table in the foreground left, candle light, distant hills and castle towers through stone arches, soft and low contrast so menu text can sit on top.',
    size: '1920x1088', quality: 'high', background: 'opaque',
    postprocess: [{ op: 'fit', width: 1920, height: 1080, position: 'centre' }, WEBP],
    notes: 'Main menu backdrop',
  },
  {
    id: 'ui/parchment', outPath: 'ui/parchment.webp', style: 'texture',
    prompt: 'Seamless tileable aged parchment paper texture, warm cream and light tan, subtle fibres, faint mottled stains, very even and light so dark text stays readable, no edges, no burns, no writing.',
    size: '1024x1024', quality: 'medium', background: 'opaque',
    postprocess: [{ op: 'seamless', axes: 'xy', width: 1024, height: 1024, blend: 0.2, position: 'centre' }, WEBP],
    notes: 'Parchment UI texture',
  },
];

const ICONS = {
  lives: 'a red heart shape made of polished garnet with a small gold rim',
  kills: 'two crossed swords with gold hilts',
  enemies: 'a dark iron footsoldier helmet with a nasal guard',
  level: 'a chevron rank insignia of three stacked gold upward chevrons',
  points: 'a small stack of three gold coins',
  trophy: 'a golden goblet trophy cup with two handles',
  lock: 'a heavy iron padlock with a keyhole',
  sword: 'a single upright longsword with a gold crossguard',
  shield: 'a kite shield in pale blue with a gold cross',
  horse: 'a white horse head in profile facing right with a pale blue bridle',
  scroll: 'a rolled parchment scroll tied with a red ribbon',
  crown: 'a gold royal crown with red and blue gems',
  skull: 'a pale bone skull',
  clock: 'a bronze hourglass with golden sand',
};
const iconAssets = Object.entries(ICONS).map(([id, desc]) => ({
  id: `icons/${id}`, outPath: `icons/${id}.webp`, style: 'icon',
  prompt: `Game UI icon: ${desc}.`,
  size: '1024x1024', quality: 'medium', background: 'transparent',
  postprocess: [{ op: 'alphaClean', threshold: 16 }, { op: 'trim' }, { op: 'contain', width: 256, height: 256, padding: 12 }, WEBP],
  notes: 'HUD/UI icon',
}));

// ---------------------------------------------------------------------------
function write(rel, data) {
  const file = path.join(PROMPTS_DIR, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
  return data.length;
}

let n = 0;
for (const env of ENVS) n += write(`env/${env.id}.json`, envAssets(env));
n += write('env/_fog.json', fogAssets);
n += write('ground.json', groundAssets);
n += write('ui.json', uiAssets);
n += write('missions.json', missionAssets);
n += write('portraits.json', portraitAssets);
n += write('icons.json', iconAssets);
console.log(`Wrote ${n} asset prompts (${ENVS.length} environments).`);
