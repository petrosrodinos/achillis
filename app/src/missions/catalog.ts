import type { EngineKind, MissionId } from '@/content/ids';

/**
 * Presentation metadata for each mission (titles, story, briefing). Pure data.
 * Gameplay configuration lives in missions/configs/*.ts.
 */
export interface StoryLine {
  speaker?: string;
  text: string;
}

export interface MissionMeta {
  id: MissionId;
  number: number;
  title: string;
  engine: EngineKind;
  /** Human label, e.g. "Quest → Boss Duel". */
  engineLabel: string;
  synopsis: string;
  objective: string;
  environments: string[];
  illustration: string;
  /** Shown on the briefing screen before the mission. */
  briefing: StoryLine[];
  /** Shown on victory. */
  outro: StoryLine[];
  /** Training Grounds has no story and is always replayable from the main menu. */
  isTraining?: boolean;
}

const art = (id: MissionId) => `/assets/images/missions/${id}.webp`;

export const MISSIONS: MissionMeta[] = [
  {
    id: 'm01', number: 1, title: 'Open Field Battle', engine: 'open-field', engineLabel: 'Open Field Battle',
    synopsis: "The kingdom's army meets an invading host beneath the old forest.",
    objective: 'Defeat or rout every enemy commander. Keep your commander alive.',
    environments: ['Forest'], illustration: art('m01'),
    briefing: [
      { text: 'Smoke rises over the border villages. An invading host has crossed into the kingdom and made camp at the edge of the old forest.' },
      { speaker: 'The King', text: 'Ride out, White Knight. Lead our foot and horse. Break their commanders and their army will scatter like leaves.' },
      { speaker: 'Orders', text: 'Tab selects a company. Q sends it to your cursor, R holds, F retreats, middle mouse charges. Fight at the front yourself — but do not fall.' },
    ],
    outro: [
      { text: 'The enemy line breaks. Banners fall into the mud as their soldiers flee through the trees.' },
      { speaker: 'Enemy Commander', text: 'You fight well, knight. But a battle is not a duel. Face me alone — if you dare.' },
    ],
  },
  {
    id: 'm02', number: 2, title: 'Commander Duel', engine: 'duel', engineLabel: 'Duel · 2 rounds',
    synopsis: 'The defeated commander demands single combat.',
    objective: 'Round 1 mounted. Round 2 on foot, helmets off.',
    environments: ['Forest Clearing'], illustration: art('m02'),
    briefing: [
      { text: 'In a clearing scarred by battle, the enemy commander waits on his warhorse, lance-straight and proud.' },
      { speaker: 'Enemy Commander', text: 'Honour demands it. Horse against horse — and when the horses fall, steel against steel, faces bare.' },
    ],
    outro: [
      { text: 'The commander kneels and offers his sword. Among his papers is a sealed letter bearing the seal of Cordova.' },
      { speaker: 'White Knight', text: 'The Black Knight of Cordova paid for this war. Then to Cordova I ride.' },
    ],
  },
  {
    id: 'm03', number: 3, title: 'Quest to Cordova', engine: 'quest', engineLabel: 'Quest → Boss Duel',
    synopsis: 'Fight through forest and mountain pass to the gates of Cordova.',
    objective: 'Clear three stages of enemies, then defeat the Black Knight in three rounds.',
    environments: ['Forest', 'Mountains', 'City Gate & Bridge'], illustration: art('m03'),
    briefing: [
      { text: 'The road to Cordova is long and guarded. Archers line the ridges and spearmen hold every pass.' },
      { speaker: 'White Knight', text: 'Shield up against their arrows and spears. Strike when they reload.' },
      { text: 'At the great bridge before the city gate, the Black Knight himself awaits.' },
    ],
    outro: [
      { text: 'The Black Knight falls to one knee, then vanishes into the city with his guard. His dropped satchel holds a map.' },
      { speaker: 'White Knight', text: 'A tower on the far coast… and a prisoner. Whoever holds the tower holds the key to all of this.' },
    ],
  },
  {
    id: 'm04', number: 4, title: 'Quest to the Wizard Tower', engine: 'quest', engineLabel: 'Quest → Boss Duel',
    synopsis: 'Cross the mountains and the coast to the dark tower.',
    objective: 'Clear three stages, then defeat the Mysterious Knight in a mounted duel.',
    environments: ['Mountains', 'Coastline', 'Dark Tower'], illustration: art('m04'),
    briefing: [
      { text: 'Beyond the mountains, a black tower rises from the sea cliffs. Mercenaries guard the coast road.' },
      { text: 'At its foot rides a knight in violet-dark armour who commands spells as easily as steel.' },
      { speaker: 'Warning', text: 'Your shield cannot stop magic. Dodge his beams and fireballs.' },
    ],
    outro: [
      { speaker: 'Mysterious Knight', text: 'Enough. I served the Wizard under a spell — your blade has broken it. I will ride with you.' },
      { text: 'Brown Feather, the Bronze Knight, arrives with fresh horses and swears to follow you as well.' },
    ],
  },
  {
    id: 'm05', number: 5, title: 'Overcoming the Shadows', engine: 'quest', engineLabel: 'Quest → Boss',
    synopsis: 'Descend into the tower to free the imprisoned ally.',
    objective: 'Survive the halls, then outlast the Wizard until his mana runs dry.',
    environments: ['Dark Hallway', 'Shadow Mirror Hall', 'Grand Hall'], illustration: art('m05'),
    briefing: [
      { text: 'Inside the tower, the halls twist with shadow. Ghosts drift through the walls, the dead walk, and servants lie in wait.' },
      { speaker: 'Mysterious Knight', text: 'The Wizard cannot be harmed by steel. Every spell drains his mana. Survive — destroy what he summons — and he will break.' },
    ],
    outro: [
      { text: 'His mana spent, the Wizard flees through a mirror that shatters behind him.' },
      { text: 'In the dungeon below, the imprisoned ally is free at last.' },
    ],
  },
  {
    id: 'm06', number: 6, title: 'Voyage Home', engine: 'quest', engineLabel: 'Quest → Duel',
    synopsis: 'As the Mysterious Knight, sail home through storms and enemy ships.',
    objective: 'Survive the voyage, then win a two-round duel against a Paladin.',
    environments: ['Dark Tower Coast', 'Open Sea', 'European Coast'], illustration: art('m06'),
    briefing: [
      { text: 'The company sets sail from the tower coast. You stand watch as the Mysterious Knight.' },
      { speaker: 'Mysterious Knight', text: 'Enemy ships fly the Cordovan flag. Their archers will rake our deck. Keep the shield high and mind the wind.' },
      { text: 'On the European shore, a tournament Paladin mistakes you for the enemy and demands a duel.' },
    ],
    outro: [
      { speaker: 'Blue Paladin', text: 'Forgive me — I see now you are a friend of the White Knight. The tournament grounds are open to you all.' },
      { text: 'The Paladins of the realm will spar with you whenever you wish.' },
    ],
  },
  {
    id: 'm07', number: 7, title: 'Training Grounds', engine: 'duel', engineLabel: 'Duel · Tournament',
    synopsis: 'Choose any fighter and opponent. Mounted or on foot. One round.',
    objective: 'Win a tournament bout.',
    environments: ['Tournament Grounds'], illustration: art('m07'), isTraining: true,
    briefing: [{ text: 'The tournament field is open. Choose your champion and your rival.' }],
    outro: [{ text: 'The crowd roars. Return whenever you wish to test your steel.' }],
  },
  {
    id: 'm08', number: 8, title: 'Search for the Sacred Herb', engine: 'quest', engineLabel: 'Quest → Boss',
    synopsis: 'Seek the herb that can lift a curse.',
    objective: 'Cross forest and lake, then defeat the Witch Spirit.',
    environments: ['Forest', 'Lake', 'Ancient Stone Grounds'], illustration: art('m08'),
    briefing: [
      { text: 'Brown Feather has fallen under a curse. Only the Sacred Herb, which grows within the ancient stones, can save him.' },
      { text: 'Bandits, wild beasts and raiding Northmen stand between you and the stones — and a Witch Spirit guards the herb.' },
      { speaker: 'Warning', text: 'Her stun spell freezes you in place. Dodge it.' },
    ],
    outro: [{ text: 'The Witch Spirit dissolves into mist. The Sacred Herb glows softly in your hand.' }],
  },
  {
    id: 'm09', number: 9, title: 'Flight to the Fortress', engine: 'quest', engineLabel: 'Quest · Hippogryph Flight',
    synopsis: 'Fly the Hippogryph through storms to the enemy fortress.',
    objective: 'Avoid birds, wind, storms and fortress fire. Land safely on the walls.',
    environments: ['Continental Sky', 'Storm Zone', 'Fortress Airspace'], illustration: art('m09'),
    briefing: [
      { text: 'The cursed ally has been taken to the Evil Witch’s fortress. No road reaches it — but a Hippogryph can.' },
      { speaker: 'Flight', text: 'W and S climb and dive. Space dodges. Gusts will push you; storms will burn you. Land on the fortress walls.' },
    ],
    outro: [{ text: 'The Hippogryph touches down on the battlements. You are inside the fortress.' }],
  },
  {
    id: 'm10', number: 10, title: 'Breaking the Curse', engine: 'quest', engineLabel: 'Quest → 2 Bosses',
    synopsis: 'Storm the fortress, free your bewitched ally and face the Evil Witch.',
    objective: 'Clear the fortress, defeat the Bewitched Ally, then drain the Evil Witch’s mana.',
    environments: ['Fortress Walls', 'Fortress Hallways', 'Fortress Dungeon'], illustration: art('m10'),
    briefing: [
      { text: 'Servants and the walking dead fill the fortress. In the dungeon, your friend waits — eyes glowing with a sickly light.' },
      { speaker: 'White Knight', text: 'Forgive me, friend. I must strike you to free you.' },
      { speaker: 'Tag Team', text: 'Against the Witch you fight two-against-one. If she stuns your fighter, your partner tags in. Press E to tag manually.' },
    ],
    outro: [{ text: 'The curse breaks. The Evil Witch’s power gutters out, and the fortress falls silent.' }],
  },
  {
    id: 'm11', number: 11, title: 'Return Home', engine: 'quest', engineLabel: 'Flight → Boss Duel',
    synopsis: 'As Green Chestnut, fly home and save a young lady from the Swamp Troll.',
    objective: 'Survive the flight, land on the right coast, defeat the Swamp Troll.',
    environments: ['Above the Ocean', 'Continental Sky', 'Landing Coast'], illustration: art('m11'),
    briefing: [
      { text: 'Green Chestnut takes the Hippogryph home over the sea. Foreign cities fire on any rider they see.' },
      { text: 'On the swampy coast, a cry for help: a Swamp Troll has seized a young lady.' },
    ],
    outro: [{ text: 'The troll sinks into the mire. The young lady is safe — and Green Chestnut’s courage will not be forgotten.' }],
  },
  {
    id: 'm12', number: 12, title: 'Mercenary Battle', engine: 'open-field', engineLabel: 'Open Field Battle',
    synopsis: 'Fight as a Rogue Paladin for a neighbouring kingdom.',
    objective: 'Win the battle: defeat or rout every enemy commander.',
    environments: ['Mercenary Field'], illustration: art('m12'),
    briefing: [
      { text: 'Under a borrowed banner and a plain grey helm, you take service with a neighbouring kingdom as a Rogue Paladin.' },
      { text: 'Two Saracen leaders command the opposing host. Lead your companies and break them.' },
    ],
    outro: [
      { text: 'The field is won. That night, the enemy leader comes to your tent under a flag of truce.' },
      { speaker: 'Saracen Leader', text: 'The Emperor seeks a champion. Wear his colours in the arena — and you will learn who truly pays the Black Knight.' },
    ],
  },
  {
    id: 'm13', number: 13, title: "Emperor's Champion", engine: 'duel', engineLabel: 'Duel · 2 rounds',
    synopsis: 'Disguised as the Emperor, face the White Knight himself.',
    objective: 'Round 1 mounted, round 2 on foot.',
    environments: ['Imperial Arena'], illustration: art('m13'),
    briefing: [
      { text: 'Clad in the Emperor’s purple and gold, you ride into the imperial arena. Across the sand waits the White Knight — now fighting for the other side.' },
      { speaker: 'Herald', text: 'Champions! First with horse and blade — then on foot until one yields!' },
    ],
    outro: [{ text: 'The helm comes off. The court gasps. Old friends recognise each other, and the plot against the realm unravels.' }],
  },
  {
    id: 'm14', number: 14, title: 'The White Knight', engine: 'quest', engineLabel: 'Quest',
    synopsis: 'Escort Green Chestnut across the Balkans to the Duke’s court.',
    objective: 'Clear three stages. Keep Green Chestnut alive.',
    environments: ['Balkan Forest', 'Valachia Mountains', 'German Fields'], illustration: art('m14'),
    briefing: [
      { text: 'The Duke has agreed to receive Green Chestnut at court. The journey is long: bandits, wolves and Balkan soldiers prowl every road.' },
      { speaker: 'Escort', text: 'Green Chestnut travels with you. If he falls, the mission fails.' },
    ],
    outro: [{ text: 'At the Duke’s court, Green Chestnut is accepted with honour. A wedding is planned for the spring.' }],
  },
  {
    id: 'm15', number: 15, title: 'Final Battle', engine: 'duel', engineLabel: 'Duel · 3 rounds',
    synopsis: 'The Black Knight attacks the wedding. End this.',
    objective: 'Round 1 mounted, round 2 on foot, round 3 without helmets.',
    environments: ['Wedding Courtyard'], illustration: art('m15'),
    briefing: [
      { text: 'Bells ring over the courtyard — until hooves thunder through the gate. The Black Knight has come for revenge.' },
      { speaker: 'Black Knight', text: 'You took Cordova from me. Today I take everything from you.' },
    ],
    outro: [
      { text: 'The Black Knight falls and does not rise again. The villain is defeated for good.' },
      { text: 'The wedding bells ring once more. The realm is at peace. Your campaign is complete.' },
    ],
  },
];

export const MISSIONS_BY_ID: Record<MissionId, MissionMeta> = Object.fromEntries(MISSIONS.map((m) => [m.id, m])) as Record<MissionId, MissionMeta>;

export function nextMissionId(id: MissionId): MissionId | null {
  const idx = MISSIONS.findIndex((m) => m.id === id);
  return idx >= 0 && idx < MISSIONS.length - 1 ? MISSIONS[idx + 1].id : null;
}
