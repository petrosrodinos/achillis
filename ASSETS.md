# Asset Licence Log

Every asset shipped with White Knight that was **not** authored from scratch by the project (third-party packs, downloads, samples) is logged here with its source URL, author and licence. Project-generated assets (Blender scripts, OpenAI image generation, offline audio synthesis) are also listed so their provenance is clear.

Rules:

- Prefer **CC0**. CC-BY is allowed only with the attribution recorded below (and surfaced in the in-game credits).
- No asset with an unclear or non-commercial licence may be committed.
- Each team owns its own section; edit only your section and re-read the file right before editing.

## Audio

All shipped audio lives in `app/public/assets/audio/` (`sfx/`, `music/`, `manifest.json`) and is rebuilt by `tools/audio/` (see its README). **Every third-party audio source is CC0** (public domain dedication) — no attribution is legally required, but authors are credited here and should appear in the in-game credits as a courtesy. Sources are processed (trimmed, layered, pitch-shifted, normalised, loop-crossfaded, re-encoded); the original download URL of each pack is in `tools/audio/sources.mjs`. BigSoundBank recordings are by Joseph Sardin, released CC0 (https://bigsoundbank.com/licenses.html).

| Asset / Path(s) | Source URL | Author | Licence | Notes |
|---|---|---|---|---|
| `sfx/hit-flesh`, `sfx/hit-armor`, `sfx/block-break`, `sfx/land`, `sfx/shield-raise`, `sfx/footstep-grass`, `sfx/footstep-stone`, `sfx/footstep-wood`, `sfx/footstep-snow`, `sfx/horse-hit`, `sfx/horse-death`, `sfx/dismount`, `sfx/troll-stomp`, `sfx/trap`, `sfx/rock-fall`, `sfx/catapult`, `sfx/landing`, `music/amb-battle` | [Impact Sounds](https://kenney.nl/assets/impact-sounds) | Kenney (kenney.nl) | CC0 |  |
| `sfx/dodge`, `sfx/land`, `sfx/shield-raise`, `sfx/footstep`, `sfx/dismount`, `sfx/helmet-off`, `sfx/trap` | [RPG Audio](https://kenney.nl/assets/rpg-audio) | Kenney (kenney.nl) | CC0 |  |
| `sfx/ui-confirm`, `sfx/ui-back`, `sfx/ui-error`, `sfx/ui-toggle`, `sfx/ui-type` | [Interface Sounds](https://kenney.nl/assets/interface-sounds) | Kenney (kenney.nl) | CC0 |  |
| `sfx/ui-click`, `sfx/ui-hover` | [UI Audio](https://kenney.nl/assets/ui-audio) | Kenney (kenney.nl) | CC0 |  |
| `sfx/parry`, `music/amb-battle` | [20 Sword Sound Effects (Attacks and Clashes)](https://opengameart.org/content/20-sword-sound-effects-attacks-and-clashes) | StarNinjas | CC0 |  |
| `sfx/block`, `sfx/block-break`, `music/amb-battle` | [10 Impact/Shield Blocks](https://opengameart.org/content/10-impactshield-blocks) | StarNinjas | CC0 |  |
| `sfx/growl` | [16 Monster Growls](https://opengameart.org/content/16-monster-growls) | StarNinjas | CC0 |  |
| `sfx/slide-advance`, `sfx/page-turn` | [10 Book Page Flips](https://opengameart.org/content/10-book-page-flips) | StarNinjas | CC0 |  |
| `sfx/crowd`, `sfx/order-charge`, `music/amb-crowd`, `music/amb-battle` | [Crowd Shouting/Speaking Ambience](https://opengameart.org/content/crowd-shoutingspeaking-ambience) | StarNinjas | CC0 |  |
| `sfx/swing-light`, `sfx/dodge` | [Swishes Sound Pack](https://opengameart.org/content/swishes-sound-pack) | artisticdude | CC0 |  |
| `sfx/armor-clank`, `sfx/sword-draw`, `sfx/helmet-off`, `sfx/magic-cast`, `sfx/ghost`, `sfx/ghost-summon`, `sfx/ghost-death`, `sfx/select-unit`, `sfx/enemy-alert` | [RPG Sound Pack](https://opengameart.org/content/rpg-sound-pack) | artisticdude | CC0 |  |
| `sfx/magic-cast`, `sfx/fireball`, `sfx/beam`, `sfx/tag-in`, `sfx/animal-death`, `sfx/rock-fall`, `sfx/unlock`, `sfx/points` | [80 CC0 RPG SFX](https://opengameart.org/content/80-cc0-rpg-sfx) | rubberduck | CC0 |  |
| `sfx/crowd-gasp` | [80 CC0 creature SFX](https://opengameart.org/content/80-cc0-creature-sfx) | rubberduck | CC0 |  |
| `sfx/zombie-death`, `sfx/animal-death`, `sfx/troll-stomp` | [80 CC0 creature SFX #2](https://opengameart.org/content/80-cc0-creture-sfx-2) | rubberduck | CC0 |  |
| `sfx/explosion`, `sfx/trap` | [100 CC0 SFX](https://opengameart.org/content/100-cc0-sfx) | rubberduck | CC0 |  |
| `sfx/rock-fall` | [100 CC0 SFX #2](https://opengameart.org/content/100-cc0-sfx-2) | rubberduck | CC0 |  |
| `sfx/zombie-death`, `sfx/water-splash` | [40 CC0 water / splash / slime SFX](https://opengameart.org/content/40-cc0-water-splash-slime-sfx) | rubberduck | CC0 |  |
| `sfx/explosion` | [25 CC0 bang / firework SFX](https://opengameart.org/content/25-cc0-bang-firework-sfx) | rubberduck | CC0 |  |
| `sfx/parry`, `sfx/jump`, `sfx/sword-draw`, `sfx/shield-raise`, `sfx/mount`, `sfx/dismount`, `sfx/spear-throw`, `music/amb-battle` | [Fantasy Weapons and Apparel SFX Library](https://opengameart.org/content/fantasy-weapons-and-apparel-sfx-library) | Vehicle | CC0 |  |
| `sfx/tree-swipe` | [Fantasy Sound Effects (Tinysized SFX)](https://opengameart.org/content/fantasy-sound-effects-tinysized-sfx) | Vehicle | CC0 |  |
| `sfx/death`, `sfx/grunt`, `sfx/spear-throw` | [15 vocal male strain/hurt/pain/jump sounds](https://opengameart.org/content/15-vocal-male-strainhurtpainjump-sounds) | qubodup | CC0 |  |
| `sfx/ghost`, `sfx/ghost-death` | [Ghost Monster Voice Moaning & Growling](https://opengameart.org/content/ghost-monster-voice-moaning-growling) | qubodup | CC0 |  |
| `sfx/wizard-laugh` | [Evil laughter](https://opengameart.org/content/evil-laughter) | qubodup | CC0 |  |
| `sfx/witch-laugh` | [Witch Cackle](https://opengameart.org/content/witch-cackle) | AntumDeluge | CC0 |  |
| `sfx/witch-laugh` | [Evil Cackle Laugh 2](https://opengameart.org/content/evil-cackle-laugh-2) | Nocturnal_Vanguard | CC0 |  |
| `sfx/wizard-laugh` | [Evil Laugh / Evil Laugh 2](https://opengameart.org/content/evil-laugh) | AntumDeluge | CC0 |  |
| `sfx/troll-roar` | [Big scary troll sounds](https://opengameart.org/content/big-scary-troll-sounds) | Darsycho | CC0 |  |
| `sfx/growl` | [Bear Growls](https://opengameart.org/content/bear-growls) | AntumDeluge | CC0 |  |
| `sfx/wing-flap`, `sfx/landing` | [Large Wings Flap](https://opengameart.org/content/large-wings-flap) | AntumDeluge | CC0 |  |
| `sfx/wing-flap` | [Dragon Flap](https://opengameart.org/content/dragon-flap-0) | VishwaJai | CC0 |  |
| `sfx/tree-rise` | [Tree Creaking](https://opengameart.org/content/tree-creaking) | AntumDeluge | CC0 |  |
| `sfx/block-break`, `sfx/tree-rise` | [35 wooden cracks/hits/destructions](https://opengameart.org/content/35-wooden-crackshitsdestructions) | qubodup (independent.nu ljudbank) | CC0 |  |
| `sfx/terrain-quake` | [Earthquake and Open sesame](https://opengameart.org/content/earthquake-and-open-sesame) | mieki256 | CC0 |  |
| `sfx/horn` | [Their Coming (generic horn sound)](https://opengameart.org/content/their-coming-generic-horn-sound) | StumpyStrust | CC0 |  |
| `sfx/victory` | [Classic fanfare lick](https://opengameart.org/content/classic-fanfare-lick) | fvcalderan | CC0 |  |
| `sfx/level-up` | [7 Assorted Sound Effects (Menu, Level Up)](https://opengameart.org/content/7-assorted-sound-effects-menu-level-up) | Joth | CC0 |  |
| `sfx/heal`, `sfx/mana-drain` | [Cure Magic](https://opengameart.org/content/cure-magic) | Someoneman | CC0 |  |
| `sfx/water-splash` | [6 Short water splashes](https://opengameart.org/content/6-short-water-splashes) | qubodup | CC0 |  |
| `sfx/wind` | [wind whoosh loop](https://opengameart.org/content/wind-whoosh-loop) | SketchMan3 | CC0 |  |
| `music/amb-cave` | [Loopable Dungeon Ambience](https://opengameart.org/content/loopable-dungeon-ambience) | JaggedStone | CC0 |  |
| `sfx/order-hold`, `sfx/wave-start`, `music/amb-battle` | [Horde War Drums loop](https://opengameart.org/content/horde-war-drums-loop) | William Hector | CC0 |  |
| `music/battle` | [Medieval: Battle](https://opengameart.org/content/medieval-battle) | RandomMind | CC0 |  |
| `music/duel` | [Medieval Standoff](https://opengameart.org/content/medieval-standoff) | Umplix | CC0 |  |
| `music/boss` | [Determined Pursuit (epic orchestra loop)](https://opengameart.org/content/determined-pursuit-epic-orchestra-loop) | Emma_MA | CC0 |  |
| `music/dark` | [Ancient Mysteries](https://opengameart.org/content/ancient-mysteries) | sperrylion | CC0 |  |
| `music/flight` | [Determined to Fly](https://opengameart.org/content/determined-to-fly) | OwlishMedia | CC0 |  |
| `music/sea` | [A sailor's chant](https://opengameart.org/content/a-sailors-chant) | Thimras | CC0 |  |
| `music/victory` | [Medieval: Victory Theme](https://opengameart.org/content/medieval-victory-theme) | RandomMind | CC0 |  |
| `music/story` | [Medieval: The Bard's Tale](https://opengameart.org/content/medieval-the-bards-tale) | RandomMind | CC0 |  |
| `music/menu` | [Medieval Theme](https://opengameart.org/content/medieval-theme) | Umplix | CC0 |  |
| `sfx/horse-neigh` | [Neighing of a Horse #1](https://bigsoundbank.com/s0284.html) | Joseph Sardin (BigSoundBank.com) | CC0 |  |
| `sfx/horse-neigh` | [Neighing of a horse](https://bigsoundbank.com/s0460.html) | Joseph Sardin (BigSoundBank.com) | CC0 |  |
| `sfx/horse-neigh` | [Horse neighing #4](https://bigsoundbank.com/s1541.html) | Joseph Sardin (BigSoundBank.com) | CC0 |  |
| `sfx/horse-hit`, `sfx/horse-death` | [Horse neighing #5](https://bigsoundbank.com/s1542.html) | Joseph Sardin (BigSoundBank.com) | CC0 |  |
| `sfx/horse-hit`, `sfx/horse-death` | [Horse Neighing #3](https://bigsoundbank.com/s0863.html) | Joseph Sardin (BigSoundBank.com) | CC0 |  |
| `sfx/horse-snort` | [Breath of a horse #1](https://bigsoundbank.com/s0285.html) | Joseph Sardin (BigSoundBank.com) | CC0 |  |
| `sfx/horse-snort` | [Breath of a horse #2 (snort)](https://bigsoundbank.com/s0286.html) | Joseph Sardin (BigSoundBank.com) | CC0 |  |
| `sfx/horse-snort` | [Breath horse #3](https://bigsoundbank.com/s0287.html) | Joseph Sardin (BigSoundBank.com) | CC0 |  |
| `sfx/mount`, `sfx/landing` | [Breath Horse #4](https://bigsoundbank.com/s1543.html) | Joseph Sardin (BigSoundBank.com) | CC0 |  |
| `sfx/horse-gallop` | [Horse Gallop](https://bigsoundbank.com/s0611.html) | Joseph Sardin (BigSoundBank.com) | CC0 |  |
| `sfx/swing-light` | [Sword Through the Air](https://bigsoundbank.com/s0128.html) | Joseph Sardin (BigSoundBank.com) | CC0 |  |
| `sfx/enemy-alert` | [Sword (blade slide)](https://bigsoundbank.com/s0129.html) | Joseph Sardin (BigSoundBank.com) | CC0 |  |
| `sfx/hit-flesh` | [Sword That Cuts](https://bigsoundbank.com/s0127.html) | Joseph Sardin (BigSoundBank.com) | CC0 |  |
| `sfx/swing-heavy` | [Whoosh #8 (metal tube)](https://bigsoundbank.com/s1801.html) | Joseph Sardin (BigSoundBank.com) | CC0 |  |
| `sfx/swing-heavy` | [Whoosh #7 (metal tube)](https://bigsoundbank.com/s1800.html) | Joseph Sardin (BigSoundBank.com) | CC0 |  |
| `sfx/spear-throw` | [Whoosh #10 (bamboo)](https://bigsoundbank.com/s1798.html) | Joseph Sardin (BigSoundBank.com) | CC0 |  |
| `sfx/swing-heavy`, `sfx/spear-throw` | [Whoosh #5 (wooden stick)](https://bigsoundbank.com/s1797.html) | Joseph Sardin (BigSoundBank.com) | CC0 |  |
| `sfx/whoosh-dodge`, `sfx/tag-in`, `sfx/tree-swipe` | [Whoosh #3 (rope)](https://bigsoundbank.com/s1795.html) | Joseph Sardin (BigSoundBank.com) | CC0 |  |
| `sfx/swing-heavy`, `sfx/whoosh-dodge`, `sfx/tree-swipe`, `sfx/catapult`, `sfx/slide-advance` | [Whoosh #4 (rope)](https://bigsoundbank.com/s1796.html) | Joseph Sardin (BigSoundBank.com) | CC0 |  |
| `sfx/hit-armor` | [Punch #4](https://bigsoundbank.com/s2459.html) | Joseph Sardin (BigSoundBank.com) | CC0 |  |
| `sfx/hit-flesh`, `sfx/hit-armor`, `sfx/horse-hit` | [Punch #5](https://bigsoundbank.com/s2460.html) | Joseph Sardin (BigSoundBank.com) | CC0 |  |
| `sfx/hit-flesh`, `sfx/hit-armor` | [Punch #6](https://bigsoundbank.com/s2461.html) | Joseph Sardin (BigSoundBank.com) | CC0 |  |
| `sfx/hit-flesh` | [Punch #8](https://bigsoundbank.com/s2463.html) | Joseph Sardin (BigSoundBank.com) | CC0 |  |
| `sfx/hit-flesh` | [Punch #10](https://bigsoundbank.com/s2465.html) | Joseph Sardin (BigSoundBank.com) | CC0 |  |
| `sfx/bow-shoot` | [Archery](https://bigsoundbank.com/s0549.html) | Joseph Sardin (BigSoundBank.com) | CC0 |  |
| `sfx/arrow-impact` | [An arrow on a target](https://bigsoundbank.com/s0548.html) | Joseph Sardin (BigSoundBank.com) | CC0 |  |
| `sfx/death`, `sfx/horse-death` | [Body Fall #1](https://bigsoundbank.com/s2452.html) | Joseph Sardin (BigSoundBank.com) | CC0 |  |
| `sfx/death` | [Body Fall #2](https://bigsoundbank.com/s2453.html) | Joseph Sardin (BigSoundBank.com) | CC0 |  |
| `sfx/death`, `sfx/horse-death` | [Body fall #3](https://bigsoundbank.com/s2454.html) | Joseph Sardin (BigSoundBank.com) | CC0 |  |
| `sfx/crowd-gasp` | [Applause: 150 People](https://bigsoundbank.com/s0019.html) | Joseph Sardin (BigSoundBank.com) | CC0 |  |
| `sfx/crowd` | [Shouts and Applauses of Teens #1](https://bigsoundbank.com/s0236.html) | Joseph Sardin (BigSoundBank.com) | CC0 |  |
| `sfx/crowd-cheer` | [Shouts and Applauses of Teens #2](https://bigsoundbank.com/s0237.html) | Joseph Sardin (BigSoundBank.com) | CC0 |  |
| `sfx/round-bell` | [Boxing bell #1](https://bigsoundbank.com/s1926.html) | Joseph Sardin (BigSoundBank.com) | CC0 |  |
| `sfx/round-bell` | [Boxing bell #3](https://bigsoundbank.com/s1928.html) | Joseph Sardin (BigSoundBank.com) | CC0 |  |
| `sfx/low-health` | [Heartbeat #1](https://bigsoundbank.com/s0243.html) | Joseph Sardin (BigSoundBank.com) | CC0 |  |
| `sfx/low-health` | [Heartbeat #2](https://bigsoundbank.com/s0244.html) | Joseph Sardin (BigSoundBank.com) | CC0 |  |
| `sfx/thunder` | [Thunder #2](https://bigsoundbank.com/s3113.html) | Joseph Sardin (BigSoundBank.com) | CC0 |  |
| `sfx/thunder` | [Thunder #3](https://bigsoundbank.com/s3114.html) | Joseph Sardin (BigSoundBank.com) | CC0 |  |
| `sfx/thunder` | [Thunder #1](https://bigsoundbank.com/s2718.html) | Joseph Sardin (BigSoundBank.com) | CC0 |  |
| `music/amb-wind` | [Wind (foley)](https://bigsoundbank.com/s0595.html) | Joseph Sardin (BigSoundBank.com) | CC0 |  |
| `sfx/wind` | [Strong wind #4](https://bigsoundbank.com/s0154.html) | Joseph Sardin (BigSoundBank.com) | CC0 |  |
| `sfx/wave-splash` | [Sea: Waves](https://bigsoundbank.com/s0266.html) | Joseph Sardin (BigSoundBank.com) | CC0 |  |
| `music/amb-sea` | [Sea Waves (Atlantic)](https://bigsoundbank.com/s0698.html) | Joseph Sardin (BigSoundBank.com) | CC0 |  |
| `sfx/wave-splash` | [Splash, Big #1](https://bigsoundbank.com/s1519.html) | Joseph Sardin (BigSoundBank.com) | CC0 |  |
| `sfx/water-splash` | [Splash, Small #1](https://bigsoundbank.com/s1529.html) | Joseph Sardin (BigSoundBank.com) | CC0 |  |
| `sfx/terrain-quake`, `sfx/rock-fall` | [Fall of Stone](https://bigsoundbank.com/s1022.html) | Joseph Sardin (BigSoundBank.com) | CC0 |  |
| `sfx/explosion` | [Explosion #2](https://bigsoundbank.com/s1808.html) | Joseph Sardin (BigSoundBank.com) | CC0 |  |
| `sfx/bird` | [Carrion Crow #3](https://bigsoundbank.com/s3463.html) | Joseph Sardin (BigSoundBank.com) | CC0 |  |
| `sfx/bird` | [Carrion crow #1](https://bigsoundbank.com/s3461.html) | Joseph Sardin (BigSoundBank.com) | CC0 |  |
| `sfx/wing-flap` | [Flight Bird #1](https://bigsoundbank.com/s2891.html) | Joseph Sardin (BigSoundBank.com) | CC0 |  |
| `sfx/horn`, `sfx/order-charge`, `music/amb-battle` | [Horn #5](https://bigsoundbank.com/s2524.html) | Joseph Sardin (BigSoundBank.com) | CC0 |  |
| `sfx/order-move` | [Horn #1](https://bigsoundbank.com/s2520.html) | Joseph Sardin (BigSoundBank.com) | CC0 |  |
| `sfx/order-retreat` | [Horn #3](https://bigsoundbank.com/s2522.html) | Joseph Sardin (BigSoundBank.com) | CC0 |  |
| `sfx/page-turn` | [Great Page that Turns #1](https://bigsoundbank.com/s0362.html) | Joseph Sardin (BigSoundBank.com) | CC0 |  |
| `sfx/page-turn` | [Turned Page](https://bigsoundbank.com/s0164.html) | Joseph Sardin (BigSoundBank.com) | CC0 |  |
| `sfx/ghost` | [Ghost #1](https://bigsoundbank.com/s2046.html) | Joseph Sardin (BigSoundBank.com) | CC0 |  |
| `sfx/ghost-summon` | [Ghost #3](https://bigsoundbank.com/s2048.html) | Joseph Sardin (BigSoundBank.com) | CC0 |  |
| `sfx/zombie` | [Zombie #7](https://bigsoundbank.com/s2112.html) | Joseph Sardin (BigSoundBank.com) | CC0 |  |
| `sfx/zombie` | [Zombie #6](https://bigsoundbank.com/s2111.html) | Joseph Sardin (BigSoundBank.com) | CC0 |  |
| `sfx/zombie` | [Zombie #5](https://bigsoundbank.com/s2110.html) | Joseph Sardin (BigSoundBank.com) | CC0 |  |
| `sfx/zombie-death` | [Zombie #4](https://bigsoundbank.com/s2109.html) | Joseph Sardin (BigSoundBank.com) | CC0 |  |
| `sfx/witch-laugh` | [Strident Laughter (witch)](https://bigsoundbank.com/s0489.html) | Joseph Sardin (BigSoundBank.com) | CC0 |  |
| `sfx/wizard-laugh` | [Laughter (man/ogre)](https://bigsoundbank.com/s0490.html) | Joseph Sardin (BigSoundBank.com) | CC0 |  |
| `sfx/death` | [Cry of Pain](https://bigsoundbank.com/s2361.html) | Joseph Sardin (BigSoundBank.com) | CC0 |  |
| `sfx/defeat` | [Gong, strong #1](https://bigsoundbank.com/s1483.html) | Joseph Sardin (BigSoundBank.com) | CC0 |  |
| `sfx/armor-clank` | [Medium Chain #1](https://bigsoundbank.com/s0360.html) | Joseph Sardin (BigSoundBank.com) | CC0 |  |
| `sfx/ship-creak` | [Long creaking door](https://bigsoundbank.com/s0306.html) | Joseph Sardin (BigSoundBank.com) | CC0 |  |
| `sfx/ship-creak` | [Big rope (creak)](https://bigsoundbank.com/s3426.html) | Joseph Sardin (BigSoundBank.com) | CC0 |  |
| `sfx/ship-creak`, `sfx/catapult` | [Rope #2 (creak)](https://bigsoundbank.com/s3421.html) | Joseph Sardin (BigSoundBank.com) | CC0 |  |
| `sfx/tree-rise` | [Broken twigs #1](https://bigsoundbank.com/s1299.html) | Joseph Sardin (BigSoundBank.com) | CC0 |  |
| `sfx/stun` | [Chimes "Dream" #1](https://bigsoundbank.com/s2079.html) | Joseph Sardin (BigSoundBank.com) | CC0 |  |
| `sfx/stun`, `sfx/unlock` | [Chimes "Dream" #8](https://bigsoundbank.com/s2086.html) | Joseph Sardin (BigSoundBank.com) | CC0 |  |
| `sfx/beam` | [Gasoline Fire #2](https://bigsoundbank.com/s1341.html) | Joseph Sardin (BigSoundBank.com) | CC0 |  |
| `music/amb-forest` | [Forest (ambience)](https://bigsoundbank.com/s0100.html) | Joseph Sardin (BigSoundBank.com) | CC0 |  |
| `music/amb-storm` | [Rain and Thunder #2](https://bigsoundbank.com/s0740.html) | Joseph Sardin (BigSoundBank.com) | CC0 |  |
| `sfx/crowd-cheer` | [Applause: 600 People](https://bigsoundbank.com/s0021.html) | Joseph Sardin (BigSoundBank.com) | CC0 |  |
| `sfx/beam` (synth layer) | `tools/audio/synth/beam.mjs` | White Knight project (generated offline) | Project-owned | Synthesised energy-beam core, layered with CC0 recordings listed above |
| `music/amb-battle` (mix) | `tools/audio/recipes.mjs` → `BATTLE_BED` | White Knight project (mix) | Project mix of CC0 sources | Crowd shouting + war drums + sword clashes, all CC0 sources listed above |

## Images (2D)

All 2D images under `app/public/assets/images/` are **generated by the project** with the OpenAI Images API from the committed prompt files in `tools/generate-images/prompts/` (shared style in `prompts/style.json`) and post-processed by `tools/generate-images/` (sharp: resize, seamless tiling, WebP). No third-party image assets are used. Per the OpenAI Terms of Use, the output belongs to the project; no attribution is required.

| Asset / Path(s) | Source | Author | Licence | Notes |
|---|---|---|---|---|
| `images/env/<envId>/sky.webp` (29) | OpenAI `gpt-image-2`, medium | White Knight project (generated) | Project-owned (OpenAI ToU) | Opaque, 2048×1024, tiles horizontally |
| `images/env/<envId>/{far,mid,fore}.webp` (87) | OpenAI `gpt-image-1.5`, medium, transparent background | White Knight project (generated) | Project-owned (OpenAI ToU) | 2048×1024, alpha, tiles horizontally |
| `images/env/_fog/{light,dark,storm}.webp` | OpenAI `gpt-image-2`, medium (white-on-black, luma-keyed) | White Knight project (generated) | Project-owned (OpenAI ToU) | 2048×1024, alpha, tiles horizontally |
| `images/ground/*.webp` (7) | OpenAI `gpt-image-2`, medium | White Knight project (generated) | Project-owned (OpenAI ToU) | 1024×1024, tiles on both axes |
| `images/ui/{title,menu}.webp` | OpenAI `gpt-image-2`, high | White Knight project (generated) | Project-owned (OpenAI ToU) | 1920×1080 |
| `images/ui/parchment.webp` | OpenAI `gpt-image-2`, medium | White Knight project (generated) | Project-owned (OpenAI ToU) | 1024×1024, tiles on both axes |
| `images/missions/m01…m15.webp` | OpenAI `gpt-image-2`, high | White Knight project (generated) | Project-owned (OpenAI ToU) | 1536×1024 story illustrations |
| `images/portraits/<CharacterId>.webp` (14) | OpenAI `gpt-image-2`, high | White Knight project (generated) | Project-owned (OpenAI ToU) | 768×768, dark vignette background |
| `images/icons/*.webp` (14) | OpenAI `gpt-image-1.5`, medium, transparent background | White Knight project (generated) | Project-owned (OpenAI ToU) | 256×256, alpha |
