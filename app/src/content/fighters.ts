import { DAMAGE, HEALTH, REACH } from '@/core/combat/combat-config';
import type { FighterLook, FighterStats, ProjectileKind } from '@/core/sim/types';
import type { CharacterId, EnemyType, FighterSkinId } from './ids';

/** Archetype = stats + look + AI controller. Engines instantiate fighters from these. */
export interface FighterArchetype {
  name: string;
  look: FighterLook;
  stats: FighterStats;
  /** AI controller id used when not player-controlled (core/ai). */
  ai: string;
  enemyType: EnemyType | null;
}

const baseStats = (over: Partial<FighterStats> = {}): FighterStats => ({
  maxHp: HEALTH.playerFoot,
  speed: 1,
  weight: 1,
  reach: REACH.foot,
  lightDamage: DAMAGE.light,
  heavyDamage: DAMAGE.heavy,
  bossHeavy: false,
  attackSpeed: 1,
  canBlock: true,
  canDodge: true,
  canJump: true,
  poise: 'none',
  width: 0.8,
  height: 1.9,
  ranged: null,
  contactDamage: 0,
  flying: false,
  ...over,
});

const knight = (name: string, skin: FighterSkinId, over: Partial<FighterStats> = {}): FighterArchetype => ({
  name,
  look: { model: 'humanoid', skin, scale: 1 },
  stats: baseStats(over),
  ai: 'duelist',
  enemyType: null,
});

export const CHARACTER_ARCHETYPES: Record<CharacterId, FighterArchetype> = {
  'white-knight': knight('White Knight', 'white-knight'),
  'bronze-knight': knight('Bronze Knight', 'bronze-knight', { weight: 1.1, attackSpeed: 0.97 }),
  'mysterious-knight': knight('Mysterious Knight', 'mysterious-knight', { speed: 1.05, attackSpeed: 1.04 }),
  'green-chestnut': knight('Green Chestnut', 'green-chestnut', { speed: 1.12, attackSpeed: 1.08, weight: 0.9 }),
  'black-knight': knight('Black Knight', 'black-knight', { weight: 1.25, attackSpeed: 0.95, heavyDamage: 28 }),
  'saracen-leader-1': knight('Crimson Emir', 'saracen-leader-1', { speed: 1.08, attackSpeed: 1.05 }),
  'saracen-leader-2': knight('Indigo Vizier', 'saracen-leader-2', { speed: 1.06, reach: REACH.foot + 0.1 }),
  'pink-paladin': knight('Pink Paladin', 'pink-paladin', { speed: 1.1, attackSpeed: 1.06, weight: 0.9 }),
  'red-paladin': knight('Red Paladin', 'red-paladin', { attackSpeed: 1.08 }),
  'blue-paladin': knight('Oliver, Blue Paladin', 'blue-paladin', { weight: 1.15 }),
  'deer-paladin': knight('Renault, Deer Paladin', 'deer-paladin', { reach: REACH.foot + 0.15 }),
  'orange-paladin': knight('Orange Paladin', 'orange-paladin', { heavyDamage: 27 }),
  'yellow-paladin': knight('Yellow Paladin', 'yellow-paladin', { speed: 0.97, weight: 1.1 }),
  'emperor-knight': knight('Emperor Knight', 'emperor-knight', { weight: 1.2, heavyDamage: 28, attackSpeed: 1.04 }),
};

export const STORY_ARCHETYPES: Record<'enemy-commander' | 'rogue-paladin' | 'emperor-disguise' | 'bewitched-ally', FighterArchetype> = {
  'enemy-commander': knight('Enemy Commander', 'enemy-commander', { weight: 1.1 }),
  'rogue-paladin': knight('Rogue Paladin', 'rogue-paladin'),
  'emperor-disguise': knight('The "Emperor"', 'emperor-disguise'),
  'bewitched-ally': knight('Bewitched Ally', 'bewitched-ally', { weight: 1.1, attackSpeed: 1.05 }),
};

const enemy = (name: string, enemyType: EnemyType, look: Omit<FighterLook, 'scale'> & { scale?: number }, ai: string, over: Partial<FighterStats>): FighterArchetype => ({
  name,
  enemyType,
  ai,
  look: { scale: 1, ...look },
  stats: baseStats({ maxHp: HEALTH.unitFoot, speed: 0.85, ...over }),
});

const ranged = (kind: ProjectileKind) => ({ ranged: kind });

export type EnemyLookId =
  | 'infantry' | 'spearman' | 'archer' | 'cavalry' | 'bandit' | 'viking' | 'balkan-soldier' | 'wolf' | 'boar'
  | 'ghost' | 'zombie' | 'servant' | 'ship-archer' | 'city-archer' | 'bird' | 'haunted-tree';

export const ENEMY_ARCHETYPES: Record<EnemyLookId, FighterArchetype> = {
  infantry: enemy('Infantry', 'infantry', { model: 'humanoid', skin: 'infantry' }, 'melee', {}),
  spearman: enemy('Spearman', 'spearman', { model: 'humanoid', skin: 'spearman' }, 'spearman', { reach: REACH.spear, ...ranged('spear') }),
  archer: enemy('Archer', 'archer', { model: 'humanoid', skin: 'archer' }, 'archer', { canBlock: false, maxHp: 60, ...ranged('arrow') }),
  cavalry: enemy('Cavalry', 'cavalry', { model: 'humanoid', skin: 'cavalry' }, 'melee', { maxHp: HEALTH.unitMounted }),
  bandit: enemy('Bandit', 'bandit', { model: 'humanoid', skin: 'bandit' }, 'skirmisher', { speed: 1.05, attackSpeed: 1.15, maxHp: 65, canBlock: false }),
  viking: enemy('Northman', 'viking', { model: 'humanoid', skin: 'viking' }, 'brute', { maxHp: 90, heavyDamage: 28, weight: 1.2, attackSpeed: 0.92 }),
  'balkan-soldier': enemy('Balkan Soldier', 'balkan-soldier', { model: 'humanoid', skin: 'balkan-soldier' }, 'spearman', { reach: REACH.spear, ...ranged('javelin') }),
  wolf: enemy('Wolf', 'wolf', { model: 'wolf', skin: 'wolf' }, 'beast', { maxHp: 45, speed: 1.6, reach: REACH.animal, canBlock: false, canJump: false, width: 1.2, height: 0.9, lightDamage: 10, heavyDamage: 15, weight: 0.7, poise: 'none' }),
  boar: enemy('Boar', 'boar', { model: 'boar', skin: 'boar' }, 'beast', { maxHp: 70, speed: 1.3, reach: REACH.animal, canBlock: false, canJump: false, width: 1.3, height: 0.9, lightDamage: 12, heavyDamage: 20, weight: 1.3 }),
  ghost: enemy('Ghost', 'ghost', { model: 'humanoid', skin: 'ghost', spectral: true }, 'ghost', { maxHp: 50, canBlock: false, canJump: false, flying: true, contactDamage: 0, speed: 0.9 }),
  zombie: enemy('Zombie', 'zombie', { model: 'humanoid', skin: 'zombie' }, 'brute', { maxHp: 90, speed: 0.55, canBlock: false, canDodge: false, poise: 'light', attackSpeed: 0.85 }),
  servant: enemy('Servant', 'servant', { model: 'humanoid', skin: 'servant', scale: 0.92 }, 'skirmisher', { maxHp: 55, speed: 1.05, canBlock: false, attackSpeed: 1.1 }),
  'ship-archer': enemy('Ship Archer', 'archer', { model: 'humanoid', skin: 'archer' }, 'archer', { canBlock: false, maxHp: 60, ...ranged('arrow') }),
  'city-archer': enemy('City Archer', 'archer', { model: 'humanoid', skin: 'archer' }, 'archer', { canBlock: false, maxHp: 60, ...ranged('arrow') }),
  bird: enemy('Bird', 'wolf', { model: 'bird', skin: 'bird' }, 'bird', { maxHp: 10, canBlock: false, canDodge: false, canJump: false, flying: true, contactDamage: DAMAGE.bird, width: 1.0, height: 0.6, speed: 1.6 }),
  'haunted-tree': enemy('Haunted Tree', 'ghost', { model: 'haunted-tree', skin: 'haunted-tree' }, 'tree', { maxHp: 60, canBlock: false, canDodge: false, canJump: false, poise: 'full', speed: 0, reach: 3.2, width: 1.6, height: 4, heavyDamage: DAMAGE.treeSwipe }),
};

/** Bosses are archetypes with boss stats; special behaviour comes from bosses/ modules. */
export const BOSS_ARCHETYPES = {
  'black-knight': { ...knight('The Black Knight', 'black-knight', { weight: 1.3, bossHeavy: true, attackSpeed: 1.0 }), ai: 'duelist' },
  'mysterious-knight': { ...knight('The Mysterious Knight', 'mysterious-knight', { bossHeavy: true }), ai: 'duelist' },
  wizard: {
    name: 'The Wizard', enemyType: 'boss' as EnemyType, ai: 'caster',
    look: { model: 'humanoid' as const, skin: 'wizard', scale: 1.05 },
    stats: baseStats({ maxHp: 300, canBlock: false, canJump: false, poise: 'full' as const, flying: true }),
  },
  'witch-spirit': {
    name: 'The Witch Spirit', enemyType: 'boss' as EnemyType, ai: 'caster',
    look: { model: 'humanoid' as const, skin: 'witch', scale: 1.0, spectral: true },
    stats: baseStats({ maxHp: 220, canBlock: false, canJump: false, poise: 'light' as const, flying: true, speed: 0.9 }),
  },
  'evil-witch': {
    name: 'The Evil Witch', enemyType: 'boss' as EnemyType, ai: 'caster',
    look: { model: 'humanoid' as const, skin: 'witch', scale: 1.05 },
    stats: baseStats({ maxHp: 999, canBlock: false, canJump: false, poise: 'light' as const, speed: 0.95 }),
  },
  'swamp-troll': {
    name: 'The Swamp Troll', enemyType: 'boss' as EnemyType, ai: 'brute',
    look: { model: 'troll' as const, skin: 'troll', scale: 1 },
    stats: baseStats({ maxHp: 450, weight: 3, reach: REACH.troll, bossHeavy: true, lightDamage: 15, attackSpeed: 0.8, speed: 0.75, poise: 'light' as const, canJump: false, canDodge: false, width: 1.6, height: 3.0 }),
  },
} satisfies Record<string, FighterArchetype>;

export type BossArchetypeId = keyof typeof BOSS_ARCHETYPES;

export function archetypeFor(id: CharacterId | keyof typeof STORY_ARCHETYPES): FighterArchetype {
  return (CHARACTER_ARCHETYPES as Record<string, FighterArchetype>)[id] ?? STORY_ARCHETYPES[id as keyof typeof STORY_ARCHETYPES];
}
