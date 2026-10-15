// Shared game vocabulary — must match docs/contracts.md section 3.

export const MISSION_IDS = [
  'm01',
  'm02',
  'm03',
  'm04',
  'm05',
  'm06',
  'm07',
  'm08',
  'm09',
  'm10',
  'm11',
  'm12',
  'm13',
  'm14',
  'm15',
] as const;
export type MissionId = (typeof MISSION_IDS)[number];

export const TRAINING_GROUNDS_MISSION_ID: MissionId = 'm07';
export const FIRST_MISSION_ID: MissionId = 'm01';

export const CHARACTER_IDS = [
  'white-knight',
  'bronze-knight',
  'mysterious-knight',
  'green-chestnut',
  'black-knight',
  'saracen-leader-1',
  'saracen-leader-2',
  'pink-paladin',
  'red-paladin',
  'blue-paladin',
  'deer-paladin',
  'orange-paladin',
  'yellow-paladin',
  'emperor-knight',
] as const;
export type CharacterId = (typeof CHARACTER_IDS)[number];

export const STARTER_CHARACTER_ID: CharacterId = 'white-knight';
export const EMPEROR_KNIGHT_CHARACTER_ID: CharacterId = 'emperor-knight';

export const ENEMY_TYPES = [
  'infantry',
  'spearman',
  'archer',
  'cavalry',
  'bandit',
  'viking',
  'balkan-soldier',
  'wolf',
  'boar',
  'ghost',
  'zombie',
  'servant',
  'commander',
  'boss',
] as const;
export type EnemyType = (typeof ENEMY_TYPES)[number];

export const DIFFICULTIES = ['squire', 'knight', 'champion'] as const;
export type DifficultyId = (typeof DIFFICULTIES)[number];

export const MISSION_RANKS = ['S', 'A', 'B', 'C', 'D'] as const;
export type MissionRankId = (typeof MISSION_RANKS)[number];

export const UNLOCK_SOURCES = {
  REGISTRATION: 'registration',
  MISSION: 'mission',
  SCORE_THRESHOLD: 'score_threshold',
} as const;

export const isMissionId = (value: unknown): value is MissionId =>
  typeof value === 'string' &&
  (MISSION_IDS as readonly string[]).includes(value);

export const missionIndex = (missionId: MissionId): number =>
  MISSION_IDS.indexOf(missionId);

export const nextMissionId = (missionId: MissionId): MissionId | null =>
  MISSION_IDS[missionIndex(missionId) + 1] ?? null;
