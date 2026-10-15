export const MISSION_IDS = [
  'm01', 'm02', 'm03', 'm04', 'm05', 'm06', 'm07', 'm08',
  'm09', 'm10', 'm11', 'm12', 'm13', 'm14', 'm15',
] as const;
export type MissionId = (typeof MISSION_IDS)[number];

export const CHARACTER_IDS = [
  'white-knight', 'bronze-knight', 'mysterious-knight', 'green-chestnut', 'black-knight',
  'saracen-leader-1', 'saracen-leader-2', 'pink-paladin', 'red-paladin', 'blue-paladin',
  'deer-paladin', 'orange-paladin', 'yellow-paladin', 'emperor-knight',
] as const;
export type CharacterId = (typeof CHARACTER_IDS)[number];

/** Story-only skins that are not part of the selectable roster. */
export const STORY_SKIN_IDS = ['enemy-commander', 'rogue-paladin', 'emperor-disguise', 'bewitched-ally'] as const;
export type StorySkinId = (typeof STORY_SKIN_IDS)[number];
export type FighterSkinId = CharacterId | StorySkinId;

export const ENEMY_TYPES = [
  'infantry', 'spearman', 'archer', 'cavalry', 'bandit', 'viking', 'balkan-soldier',
  'wolf', 'boar', 'ghost', 'zombie', 'servant', 'commander', 'boss',
] as const;
export type EnemyType = (typeof ENEMY_TYPES)[number];

export const ENV_IDS = [
  'forest', 'forest-clearing', 'mountains', 'city-gate', 'coastline', 'dark-tower', 'dark-hallway',
  'mirror-hall', 'grand-hall', 'tower-coast', 'open-sea', 'european-coast', 'tournament', 'lake',
  'stone-circle', 'sky-continental', 'storm-zone', 'fortress-airspace', 'fortress-walls',
  'fortress-halls', 'fortress-dungeon', 'ocean-sky', 'swamp-coast', 'mercenary-field',
  'imperial-arena', 'balkan-forest', 'valachia-mountains', 'german-fields', 'wedding-courtyard',
] as const;
export type EnvId = (typeof ENV_IDS)[number];

export const GROUND_MATERIALS = ['dirt', 'grass', 'sand', 'stone', 'snow', 'wood', 'marble'] as const;
export type GroundMaterial = (typeof GROUND_MATERIALS)[number];

export type EngineKind = 'open-field' | 'quest' | 'duel';
export type Difficulty = 'squire' | 'knight' | 'champion';
