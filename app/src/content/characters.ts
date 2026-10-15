import type { CharacterId } from './ids';

/** Display metadata for the roster (spec §10). Visual loadouts live in content/loadouts.ts. */
export interface CharacterInfo {
  id: CharacterId;
  name: string;
  alias?: string;
  description: string;
  portrait: string;
}

const portrait = (id: CharacterId) => `/assets/images/portraits/${id}.webp`;

export const CHARACTERS: Record<CharacterId, CharacterInfo> = {
  'white-knight': { id: 'white-knight', name: 'White Knight', description: 'The protagonist. Steadfast, balanced in attack and defence.', portrait: portrait('white-knight') },
  'bronze-knight': { id: 'bronze-knight', name: 'Bronze Knight', alias: 'Brown Feather', description: 'A loyal ally who joins after the Wizard Tower.', portrait: portrait('bronze-knight') },
  'mysterious-knight': { id: 'mysterious-knight', name: 'Mysterious Knight', description: 'Once a foe wielding dark magic, now a sworn ally.', portrait: portrait('mysterious-knight') },
  'green-chestnut': { id: 'green-chestnut', name: 'Green Chestnut', alias: 'Saracen Lieutenant', description: 'A swift lieutenant with a curved blade and a brave heart.', portrait: portrait('green-chestnut') },
  'black-knight': { id: 'black-knight', name: 'Black Knight', alias: 'Cordova Boss', description: 'The main antagonist. Heavy blows and iron will.', portrait: portrait('black-knight') },
  'saracen-leader-1': { id: 'saracen-leader-1', name: 'Saracen Leader', alias: 'The Crimson Emir', description: 'A commander clad in crimson and gold.', portrait: portrait('saracen-leader-1') },
  'saracen-leader-2': { id: 'saracen-leader-2', name: 'Saracen Leader', alias: 'The Indigo Vizier', description: 'A cunning commander in indigo and silver.', portrait: portrait('saracen-leader-2') },
  'pink-paladin': { id: 'pink-paladin', name: 'Pink Paladin', description: 'Tournament fighter, graceful and quick.', portrait: portrait('pink-paladin') },
  'red-paladin': { id: 'red-paladin', name: 'Red Paladin', description: 'Tournament fighter, relentless attacker.', portrait: portrait('red-paladin') },
  'blue-paladin': { id: 'blue-paladin', name: 'Blue Paladin', alias: 'Oliver', description: 'Tournament fighter, a stalwart defender.', portrait: portrait('blue-paladin') },
  'deer-paladin': { id: 'deer-paladin', name: 'Deer Paladin', alias: 'Renault', description: 'Tournament fighter crowned with antlers.', portrait: portrait('deer-paladin') },
  'orange-paladin': { id: 'orange-paladin', name: 'Orange Paladin', description: 'Tournament fighter, fiery and bold.', portrait: portrait('orange-paladin') },
  'yellow-paladin': { id: 'yellow-paladin', name: 'Yellow Paladin', description: 'Tournament fighter, patient and precise.', portrait: portrait('yellow-paladin') },
  'emperor-knight': { id: 'emperor-knight', name: 'Emperor Knight', description: 'Unlocked by achieving a high score. Imperial might.', portrait: portrait('emperor-knight') },
};
