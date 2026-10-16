import {
  CharacterId,
  EnemyType,
  MissionId,
} from '@/shared/constants/game.constants';

export type MissionEngine = 'open-field' | 'quest' | 'duel';

export interface MissionCatalogEntry {
  id: MissionId;
  engine: MissionEngine;
  /** Boss / duel opponents that can be defeated (upper bound for `bossesDefeated`). */
  bossCount: number;
  /** Par completion time — full time bonus at or below it. */
  parTimeMs: number;
  /** Plausibility floor: victories faster than this are rejected. */
  minDurationMs: number;
  /** Maximum kills per enemy type; types not listed allow 0 kills. */
  maxKillsPerType: Partial<Record<EnemyType, number>>;
  /** Upper bound for `noHitRounds` (duel rounds + quest slides). */
  maxNoHitRounds: number;
  /** Final score is clamped to this; ranks are fractions of it. */
  maxScore: number;
  /** Characters unlocked on first completion (contracts §3). */
  unlocksCharacters: CharacterId[];
}

const S = 1000;
const MIN = 60 * S;

// Caps are deliberately generous upper bounds; keep them >= the client mission configs (P8-02 balance pass).
const groundQuestKills = { infantry: 60, spearman: 60, archer: 60 } as const;

export const MISSIONS_CATALOG: Record<MissionId, MissionCatalogEntry> = {
  m01: {
    id: 'm01',
    engine: 'open-field',
    bossCount: 0,
    parTimeMs: 6 * MIN,
    minDurationMs: 30 * S,
    maxKillsPerType: {
      infantry: 200,
      spearman: 100,
      cavalry: 80,
      archer: 80,
      commander: 6,
    },
    maxNoHitRounds: 1,
    maxScore: 8000,
    unlocksCharacters: [],
  },
  m02: {
    id: 'm02',
    engine: 'duel',
    bossCount: 1,
    parTimeMs: 2.5 * MIN,
    minDurationMs: 10 * S,
    maxKillsPerType: { commander: 1 },
    maxNoHitRounds: 2,
    maxScore: 4000,
    unlocksCharacters: [],
  },
  m03: {
    id: 'm03',
    engine: 'quest',
    bossCount: 1,
    parTimeMs: 9 * MIN,
    minDurationMs: 60 * S,
    maxKillsPerType: { ...groundQuestKills },
    maxNoHitRounds: 6,
    maxScore: 8000,
    unlocksCharacters: ['black-knight'],
  },
  m04: {
    id: 'm04',
    engine: 'quest',
    bossCount: 1,
    parTimeMs: 9 * MIN,
    minDurationMs: 60 * S,
    maxKillsPerType: { ...groundQuestKills, ghost: 30 },
    maxNoHitRounds: 4,
    maxScore: 8000,
    unlocksCharacters: ['mysterious-knight', 'bronze-knight'],
  },
  m05: {
    id: 'm05',
    engine: 'quest',
    bossCount: 1,
    parTimeMs: 10 * MIN,
    minDurationMs: 60 * S,
    maxKillsPerType: { ghost: 80, zombie: 80, servant: 80 },
    maxNoHitRounds: 4,
    maxScore: 8000,
    unlocksCharacters: [],
  },
  m06: {
    id: 'm06',
    engine: 'quest',
    bossCount: 1,
    parTimeMs: 9 * MIN,
    minDurationMs: 60 * S,
    maxKillsPerType: { archer: 80, infantry: 60 },
    maxNoHitRounds: 5,
    maxScore: 7000,
    unlocksCharacters: [
      'blue-paladin',
      'deer-paladin',
      'pink-paladin',
      'red-paladin',
      'orange-paladin',
      'yellow-paladin',
    ],
  },
  m07: {
    id: 'm07',
    engine: 'duel',
    bossCount: 1,
    parTimeMs: 1.5 * MIN,
    minDurationMs: 8 * S,
    maxKillsPerType: {},
    maxNoHitRounds: 1,
    maxScore: 2000,
    unlocksCharacters: [],
  },
  m08: {
    id: 'm08',
    engine: 'quest',
    bossCount: 1,
    parTimeMs: 10 * MIN,
    minDurationMs: 60 * S,
    maxKillsPerType: { bandit: 60, wolf: 40, boar: 40, viking: 60, zombie: 30 },
    maxNoHitRounds: 4,
    maxScore: 8000,
    unlocksCharacters: [],
  },
  m09: {
    id: 'm09',
    engine: 'quest',
    bossCount: 0,
    parTimeMs: 6 * MIN,
    minDurationMs: 60 * S,
    maxKillsPerType: {},
    maxNoHitRounds: 3,
    maxScore: 5000,
    unlocksCharacters: [],
  },
  m10: {
    id: 'm10',
    engine: 'quest',
    bossCount: 2,
    parTimeMs: 12 * MIN,
    minDurationMs: 60 * S,
    maxKillsPerType: { servant: 80, zombie: 100 },
    maxNoHitRounds: 5,
    maxScore: 9000,
    unlocksCharacters: [],
  },
  m11: {
    id: 'm11',
    engine: 'quest',
    bossCount: 1,
    parTimeMs: 9 * MIN,
    minDurationMs: 60 * S,
    maxKillsPerType: { archer: 60 },
    maxNoHitRounds: 4,
    maxScore: 8000,
    unlocksCharacters: ['green-chestnut'],
  },
  m12: {
    id: 'm12',
    engine: 'open-field',
    bossCount: 0,
    parTimeMs: 7 * MIN,
    minDurationMs: 30 * S,
    maxKillsPerType: {
      infantry: 250,
      spearman: 150,
      cavalry: 100,
      archer: 100,
      commander: 8,
    },
    maxNoHitRounds: 1,
    maxScore: 9000,
    unlocksCharacters: ['saracen-leader-1', 'saracen-leader-2'],
  },
  m13: {
    id: 'm13',
    engine: 'duel',
    bossCount: 1,
    parTimeMs: 2.5 * MIN,
    minDurationMs: 10 * S,
    maxKillsPerType: {},
    maxNoHitRounds: 2,
    maxScore: 4000,
    unlocksCharacters: [],
  },
  m14: {
    id: 'm14',
    engine: 'quest',
    bossCount: 0,
    parTimeMs: 10 * MIN,
    minDurationMs: 60 * S,
    maxKillsPerType: {
      ...groundQuestKills,
      bandit: 60,
      wolf: 40,
      boar: 40,
      'balkan-soldier': 80,
    },
    maxNoHitRounds: 3,
    maxScore: 8000,
    unlocksCharacters: [],
  },
  m15: {
    id: 'm15',
    engine: 'duel',
    bossCount: 1,
    parTimeMs: 3.5 * MIN,
    minDurationMs: 15 * S,
    maxKillsPerType: {},
    maxNoHitRounds: 3,
    maxScore: 6000,
    unlocksCharacters: [],
  },
};

export const getMission = (missionId: MissionId): MissionCatalogEntry =>
  MISSIONS_CATALOG[missionId];
