# White Knight — Art Bible

Shared visual reference for Blender models, generated images and in-game tinting. Palette hex values are the in-game tints applied to the named model materials (see `docs/contracts.md` §4.1).

## Global look

- Warm, earthy, muted, hand-painted. Low saturation everywhere; only magic is vivid (arcane violet `#8b5cf6`, ember orange `#f97316`, spectral green `#4ade80`).
- Stylised proportions: broad shoulders, big hands, **oversized swords and large shields**, readable helmets, strong silhouettes. Think classic Flash-era side-view action games (*Achilles* by Armor Games) rendered as clean low-poly 3D with soft directional light.
- Backgrounds: painterly, atmospheric depth, soft edges, gentle value steps from back (light, hazy) to front (darker, more saturated). No characters in backgrounds. No text, no UI, no watermarks.

## Shared style prompt (images)

> Hand-painted 2D game background art in a warm, earthy, low-saturation palette, painterly brush texture, soft atmospheric perspective, medieval European fantasy, side-scrolling game layer, clean readable shapes, no characters, no text, no logos, no frame.

## Characters

| Id | Look | Helm | Crest | Armor | Weapon / off-hand | Primary | Secondary | Metal |
|---|---|---|---|---|---|---|---|---|
| white-knight | Heroic protagonist, gleaming white-silver plate, pale blue tabard with a gold cross | Great | Plume (white) | Plate | Sword / Kite | `#e8e4da` | `#c9a54a` | `#d5d8dc` |
| bronze-knight | "Brown Feather": bronze-brown plate, tall brown feather | Nasal | Feather | Plate | Sword / Heater | `#8a5a2b` | `#d2b48c` | `#b08d57` |
| mysterious-knight | Dark violet-grey armour, hooded great helm, faint violet glow accents | Hood (over helm) | – | Plate | Sword / Kite | `#3b3346` | `#8b5cf6` (glow) | `#5a5566` |
| green-chestnut | Saracen lieutenant: green robe over mail, chestnut-brown turban, round shield | Turban | – | Mail + Robe | Scimitar / Round | `#4b6b3a` | `#8b5a2b` | `#a7a59c` |
| black-knight | Cordova Boss: black plate with oxblood trim, horned helm, menacing | Horned | – | Plate | Sword / Heater | `#1f1d1f` | `#7a1f1f` | `#3a3a3e` |
| saracen-leader-1 | Crimson and gold robes over mail, white turban | Turban | – | Mail + Robe | Scimitar / Round | `#8e2b2b` | `#c9a54a` | `#b5b3aa` |
| saracen-leader-2 | Indigo and silver, spiked helm with mail aventail | Spiked | – | Mail + Robe | Scimitar / Round | `#2f3a6b` | `#c0c4cc` | `#9fa4ad` |
| pink-paladin | Tournament paladin, dusty rose tabard | Great | Plume | Plate | Sword / Heater | `#c98a9a` | `#efe6d8` | `#c8c8c8` |
| red-paladin | Tournament paladin, brick red tabard | Great | Plume | Plate | Sword / Heater | `#9b3328` | `#e3c27a` | `#c8c8c8` |
| blue-paladin | Oliver: steel blue tabard with silver | Great | Plume | Plate | Sword / Kite | `#3d5a80` | `#dfe3e8` | `#c8c8c8` |
| deer-paladin | Renault: tan/brown tabard, antler crest | Great | Antlers | Plate | Sword / Heater | `#9c7a52` | `#4a3520` | `#c8c8c8` |
| orange-paladin | Tournament paladin, burnt orange tabard | Great | Plume | Plate | Sword / Heater | `#c56a2d` | `#2f2a26` | `#c8c8c8` |
| yellow-paladin | Tournament paladin, ochre yellow tabard | Great | Plume | Plate | Sword / Kite | `#c9a227` | `#3a3226` | `#c8c8c8` |
| emperor-knight | Imperial gold and deep purple, crowned helm, cape | Crown | Plume | Plate | Sword / Kite | `#4b2a5c` | `#d4af37` | `#d9c27a` |

Story skins (not roster): `enemy-commander` (M2 — dark green and iron, nasal helm), `rogue-paladin` (M12 player — slate grey, no crest), `emperor-disguise` (M13 player — purple/gold great helm with crown, distinct from emperor-knight), `bewitched-ally` (M10 — Bronze Knight with sickly green glow).

## Enemies

| Type | Look | Helm / hair | Armor | Weapon / off-hand | Primary |
|---|---|---|---|---|---|
| infantry | Footsoldier, gambeson and kettle-ish helm | Nasal | Leather | Sword / Round | `#6b5b45` |
| spearman | Long spear, mail | Nasal | Mail | Spear / Buckler | `#5c4a3a` |
| archer | Hooded, leather, bow | Hood | Leather | – / Bow | `#4f5b3a` |
| cavalry | Mounted lancer-like rider | Great | Mail | Sword / Kite | `#5a4636` |
| bandit | Ragged, hood, dagger | Hood | Rags | Dagger / – | `#5a4a3a` |
| viking | Fur cloak, viking helm, axe | Viking | Fur | Axe / Round | `#6b4a2f` |
| balkan-soldier | Red-brown coat, spiked helm | Spiked | Mail | Spear / Round | `#7a3b2e` |
| zombie | Grey-green skin, rags | Hair_Long | Rags | Club / – | `#4a5a40` |
| servant | Hunched tower servant, robe | Hood | Robe | Dagger / – | `#3e3a4a` |
| ghost | Translucent spectral green humanoid | Hood | Robe | Sword / – | `#4ade80` (glow) |
| wizard (boss) | Tall robed wizard, wizard hat, staff | WizardHat | Robe | Staff / – | `#2e2a4a` |
| witch (boss) | Witch hat, tattered robe, staff | WitchHat | Robe + Rags | Staff / – | `#2a3a2a` |
| wolf, boar | Wild animals (separate models) | – | – | – | natural |
| swamp-troll (boss) | Separate model, mossy green-brown | – | – | Club | `#4d5a2e` |
