import type { CharacterId } from '@/content/ids';

/** How each fighter is unlocked (contracts §3). */
export const CharacterUnlockDescriptionOptions: Record<CharacterId, string> = {
  'white-knight': 'Your sworn knight from the start',
  'black-knight': 'Unlock: complete Mission 3',
  'mysterious-knight': 'Unlock: complete Mission 4',
  'bronze-knight': 'Unlock: complete Mission 4',
  'blue-paladin': 'Unlock: complete Mission 6',
  'deer-paladin': 'Unlock: complete Mission 6',
  'pink-paladin': 'Unlock: complete Mission 6',
  'red-paladin': 'Unlock: complete Mission 6',
  'orange-paladin': 'Unlock: complete Mission 6',
  'yellow-paladin': 'Unlock: complete Mission 6',
  'green-chestnut': 'Unlock: complete Mission 11',
  'saracen-leader-1': 'Unlock: complete Mission 12',
  'saracen-leader-2': 'Unlock: complete Mission 12',
  'emperor-knight': 'Reach 60,000 points',
};

export function getCharacterUnlockDescription(id: CharacterId): string {
  return CharacterUnlockDescriptionOptions[id];
}
