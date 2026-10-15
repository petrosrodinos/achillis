/**
 * Visual loadouts: which equipment groups of humanoid.glb are shown and how materials are tinted
 * (docs/contracts.md §4.1, docs/art-bible.md). Pure data consumed by the renderer.
 */
export type ArmorType = 'Plate' | 'Mail' | 'Leather' | 'Robe' | 'Rags' | 'Fur';
export type HelmType = 'Great' | 'Nasal' | 'Horned' | 'Turban' | 'Spiked' | 'Crown' | 'Hood' | 'WizardHat' | 'WitchHat' | 'Viking';
export type WeaponType = 'Sword' | 'Scimitar' | 'Spear' | 'Axe' | 'Club' | 'Dagger' | 'Staff';
export type OffhandType = 'Shield_Kite' | 'Shield_Round' | 'Shield_Heater' | 'Shield_Buckler' | 'Offhand_Bow' | null;

export type MaterialKey = 'Primary' | 'Secondary' | 'Metal' | 'DarkMetal' | 'Leather' | 'Skin' | 'Hair' | 'Wood' | 'Cloth' | 'Glow' | 'Horn' | 'Coat' | 'Mane' | 'Feathers' | 'Beak' | 'Eye';
export type Palette = Partial<Record<MaterialKey, string>>;

export interface Loadout {
  armor: ArmorType[];
  helm: HelmType | null;
  hair: Array<'Short' | 'Long' | 'Beard'>;
  crest: 'Plume' | 'Feather' | 'Antlers' | null;
  cape: boolean;
  tabard: boolean;
  weapon: WeaponType | null;
  offhand: OffhandType;
  palette: Palette;
}

const SKIN = '#d9a77f';
const knightBase = { armor: ['Plate'] as ArmorType[], helm: 'Great' as HelmType, hair: ['Short'] as Loadout['hair'], crest: 'Plume' as const, cape: false, tabard: true, weapon: 'Sword' as WeaponType, offhand: 'Shield_Heater' as OffhandType };

const paladin = (primary: string, secondary: string, offhand: OffhandType = 'Shield_Heater', crest: Loadout['crest'] = 'Plume'): Loadout => ({
  ...knightBase,
  crest,
  offhand,
  palette: { Primary: primary, Secondary: secondary, Metal: '#c8c8c8', Skin: SKIN, Hair: '#6b4a2b', Cloth: primary, Leather: '#5a3d26' },
});

export const LOADOUTS: Record<string, Loadout> = {
  'white-knight': { ...knightBase, cape: true, offhand: 'Shield_Kite', palette: { Primary: '#e8e4da', Secondary: '#c9a54a', Metal: '#d5d8dc', Cloth: '#9fb4cc', Skin: SKIN, Hair: '#b08a5a', Leather: '#6b4a2b' } },
  'bronze-knight': { ...knightBase, helm: 'Nasal', crest: 'Feather', hair: ['Short', 'Beard'], palette: { Primary: '#8a5a2b', Secondary: '#d2b48c', Metal: '#b08d57', Cloth: '#8a5a2b', Skin: SKIN, Hair: '#5a3a20', Leather: '#4a3020' } },
  'mysterious-knight': { ...knightBase, helm: 'Hood', crest: null, cape: true, offhand: 'Shield_Kite', palette: { Primary: '#3b3346', Secondary: '#8b5cf6', Metal: '#5a5566', DarkMetal: '#2a2630', Cloth: '#2f2838', Glow: '#a78bfa', Skin: '#c9a184', Hair: '#1e1a22' } },
  'green-chestnut': { armor: ['Mail', 'Robe'], helm: 'Turban', hair: ['Short', 'Beard'], crest: null, cape: false, tabard: false, weapon: 'Scimitar', offhand: 'Shield_Round', palette: { Primary: '#4b6b3a', Secondary: '#8b5a2b', Metal: '#a7a59c', Cloth: '#8b5a2b', Skin: '#b98660', Hair: '#3a2614', Wood: '#7a5230' } },
  'black-knight': { ...knightBase, helm: 'Horned', crest: null, cape: true, palette: { Primary: '#1f1d1f', Secondary: '#7a1f1f', Metal: '#3a3a3e', DarkMetal: '#1a1a1c', Cloth: '#5a1616', Skin: '#c99a7a', Hair: '#111111', Horn: '#d8cdb5' } },
  'saracen-leader-1': { armor: ['Mail', 'Robe'], helm: 'Turban', hair: ['Short', 'Beard'], crest: null, cape: true, tabard: false, weapon: 'Scimitar', offhand: 'Shield_Round', palette: { Primary: '#8e2b2b', Secondary: '#c9a54a', Metal: '#b5b3aa', Cloth: '#efe6d8', Skin: '#b07e58', Hair: '#1f160e' } },
  'saracen-leader-2': { armor: ['Mail', 'Robe'], helm: 'Spiked', hair: ['Short', 'Beard'], crest: null, cape: true, tabard: false, weapon: 'Scimitar', offhand: 'Shield_Round', palette: { Primary: '#2f3a6b', Secondary: '#c0c4cc', Metal: '#9fa4ad', Cloth: '#2f3a6b', Skin: '#b07e58', Hair: '#1f160e' } },
  'pink-paladin': paladin('#c98a9a', '#efe6d8'),
  'red-paladin': paladin('#9b3328', '#e3c27a'),
  'blue-paladin': paladin('#3d5a80', '#dfe3e8', 'Shield_Kite'),
  'deer-paladin': paladin('#9c7a52', '#4a3520', 'Shield_Heater', 'Antlers'),
  'orange-paladin': paladin('#c56a2d', '#2f2a26'),
  'yellow-paladin': paladin('#c9a227', '#3a3226', 'Shield_Kite'),
  'emperor-knight': { ...knightBase, helm: 'Crown', cape: true, offhand: 'Shield_Kite', palette: { Primary: '#4b2a5c', Secondary: '#d4af37', Metal: '#d9c27a', Cloth: '#4b2a5c', Skin: SKIN, Hair: '#3a2614' } },
  // Story skins.
  'enemy-commander': { ...knightBase, helm: 'Nasal', crest: 'Plume', hair: ['Short', 'Beard'], cape: true, palette: { Primary: '#3e4a32', Secondary: '#8a8f86', Metal: '#7d8086', Cloth: '#3e4a32', Skin: SKIN, Hair: '#3a2614' } },
  'rogue-paladin': { ...knightBase, crest: null, palette: { Primary: '#5b6066', Secondary: '#2c2f33', Metal: '#9a9ea3', Cloth: '#5b6066', Skin: SKIN, Hair: '#4a3420' } },
  'emperor-disguise': { ...knightBase, helm: 'Great', crest: 'Plume', cape: true, offhand: 'Shield_Kite', palette: { Primary: '#5a2d6e', Secondary: '#c9a54a', Metal: '#b9a46a', Cloth: '#5a2d6e', Skin: SKIN, Hair: '#3a2614' } },
  'bewitched-ally': { ...knightBase, helm: 'Nasal', crest: 'Feather', hair: ['Short', 'Beard'], palette: { Primary: '#6a5a2b', Secondary: '#8fbf6a', Metal: '#8f9a6a', Cloth: '#5a6a2b', Glow: '#4ade80', Skin: '#a8b48a', Hair: '#3a3a20' } },
  // Enemies.
  infantry: { armor: ['Leather'], helm: 'Nasal', hair: ['Short'], crest: null, cape: false, tabard: true, weapon: 'Sword', offhand: 'Shield_Round', palette: { Primary: '#6b5b45', Secondary: '#3d3328', Metal: '#8d8f92', Cloth: '#6b5b45', Leather: '#5a4330', Skin: SKIN, Wood: '#6b4a2b' } },
  spearman: { armor: ['Mail'], helm: 'Nasal', hair: ['Short'], crest: null, cape: false, tabard: true, weapon: 'Spear', offhand: 'Shield_Buckler', palette: { Primary: '#5c4a3a', Secondary: '#2e261e', Metal: '#9a9ca0', Cloth: '#5c4a3a', Skin: SKIN, Wood: '#6b4a2b' } },
  archer: { armor: ['Leather'], helm: 'Hood', hair: ['Short'], crest: null, cape: false, tabard: true, weapon: 'Dagger', offhand: 'Offhand_Bow', palette: { Primary: '#4f5b3a', Secondary: '#3a2e20', Metal: '#8d8f92', Cloth: '#4f5b3a', Leather: '#5a4330', Skin: SKIN, Wood: '#7a5a38' } },
  cavalry: { armor: ['Mail'], helm: 'Great', hair: ['Short'], crest: null, cape: false, tabard: true, weapon: 'Sword', offhand: 'Shield_Kite', palette: { Primary: '#5a4636', Secondary: '#2e261e', Metal: '#8a8c90', Cloth: '#5a4636', Skin: SKIN } },
  bandit: { armor: ['Rags'], helm: 'Hood', hair: ['Short', 'Beard'], crest: null, cape: false, tabard: false, weapon: 'Dagger', offhand: null, palette: { Primary: '#5a4a3a', Secondary: '#3a2e22', Cloth: '#4a3e30', Metal: '#7a7c80', Skin: SKIN, Hair: '#2a1e14' } },
  viking: { armor: ['Fur', 'Leather'], helm: 'Viking', hair: ['Long', 'Beard'], crest: null, cape: false, tabard: false, weapon: 'Axe', offhand: 'Shield_Round', palette: { Primary: '#6b4a2f', Secondary: '#a8a39a', Cloth: '#6b4a2f', Metal: '#8d8f92', Skin: '#e0b08e', Hair: '#a8713a', Wood: '#7a5230' } },
  'balkan-soldier': { armor: ['Mail'], helm: 'Spiked', hair: ['Short', 'Beard'], crest: null, cape: false, tabard: true, weapon: 'Spear', offhand: 'Shield_Round', palette: { Primary: '#7a3b2e', Secondary: '#3a2a20', Metal: '#9a9ca0', Cloth: '#7a3b2e', Skin: SKIN, Hair: '#2a1e14' } },
  zombie: { armor: ['Rags'], helm: null, hair: ['Long'], crest: null, cape: false, tabard: false, weapon: 'Club', offhand: null, palette: { Primary: '#4a5a40', Secondary: '#3a3a2e', Cloth: '#4a4a38', Skin: '#8a9a72', Hair: '#2e2a22', Wood: '#5a4a32' } },
  servant: { armor: ['Robe'], helm: 'Hood', hair: ['Short'], crest: null, cape: false, tabard: false, weapon: 'Dagger', offhand: null, palette: { Primary: '#3e3a4a', Secondary: '#6a6278', Cloth: '#3e3a4a', Metal: '#8a8a94', Skin: '#b8a090' } },
  ghost: { armor: ['Robe'], helm: 'Hood', hair: [], crest: null, cape: false, tabard: false, weapon: 'Sword', offhand: null, palette: { Primary: '#9ff5c4', Secondary: '#4ade80', Cloth: '#9ff5c4', Metal: '#c8ffe0', Skin: '#c8ffe0', Glow: '#4ade80' } },
  wizard: { armor: ['Robe'], helm: 'WizardHat', hair: ['Long', 'Beard'], crest: null, cape: false, tabard: false, weapon: 'Staff', offhand: null, palette: { Primary: '#2e2a4a', Secondary: '#c9a54a', Cloth: '#2e2a4a', Skin: '#d8b498', Hair: '#d8d4cc', Glow: '#c084fc', Wood: '#6b4a2b' } },
  witch: { armor: ['Robe', 'Rags'], helm: 'WitchHat', hair: ['Long'], crest: null, cape: false, tabard: false, weapon: 'Staff', offhand: null, palette: { Primary: '#2a3a2a', Secondary: '#6b4a2b', Cloth: '#2a3a2a', Skin: '#9ab58a', Hair: '#1a1a1a', Glow: '#4ade80', Wood: '#4a3420' } },
};

// Player-side open-field units: the kingdom's blue and white.
const allyTint = (base: Loadout): Loadout => ({ ...base, palette: { ...base.palette, Primary: '#5a7398', Secondary: '#e8e4da', Cloth: '#5a7398' } });
LOADOUTS['ally-infantry'] = allyTint(LOADOUTS.infantry);
LOADOUTS['ally-spearman'] = allyTint(LOADOUTS.spearman);
LOADOUTS['ally-archer'] = allyTint(LOADOUTS.archer);
LOADOUTS['ally-cavalry'] = allyTint(LOADOUTS.cavalry);

/** Palettes for non-humanoid models. */
export const CREATURE_PALETTES: Record<string, Palette> = {
  wolf: { Coat: '#6e6a64', Mane: '#4a4642', Eye: '#e0c060' },
  boar: { Coat: '#5a4030', Mane: '#2e2018', Horn: '#e8dcc0' },
  troll: { Skin: '#4d5a2e', Primary: '#3e4a26', Cloth: '#5a4a30', Wood: '#5a4030', Hair: '#2e3a1e' },
  bird: { Feathers: '#2e2a26', Beak: '#c9a227', Eye: '#e0c060' },
  'haunted-tree': { Wood: '#4a3a2e', Glow: '#4ade80' },
  hippogryph: { Feathers: '#d8d0c0', Coat: '#a07a50', Beak: '#d9a63a', Eye: '#3a2a1a', Leather: '#5a3d26' },
};

export function loadoutFor(skin: string): Loadout {
  return LOADOUTS[skin] ?? LOADOUTS.infantry;
}

/** Horse barding takes the rider's colours. */
export function horsePalette(riderSkin: string): Palette {
  const p = LOADOUTS[riderSkin]?.palette ?? {};
  return { Coat: riderSkin === 'black-knight' ? '#1e1a18' : riderSkin === 'white-knight' ? '#d8d2c8' : '#6b4a32', Mane: '#2a1e16', Primary: p.Primary ?? '#6b5b45', Secondary: p.Secondary ?? '#c9a54a', Leather: '#4a3020', Metal: p.Metal ?? '#9a9ca0' };
}
