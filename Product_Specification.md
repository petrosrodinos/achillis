WHITE KNIGHT
Game Design Document
Platform: Web browser| Engine: React,threejs| Genre: Single-Player Medieval Action

1. PROJECT OVERVIEW
White Knight is a single-player medieval action game with a story campaign of 15 missions. The game is built entirely around three reusable gameplay engines: an Open Field Battle engine, a Quest/Journey engine, and a Duel engine. Every mission in the game is a configured version of one of these three engines using different environments, enemies, characters, and story content. No mission should require its own unique gameplay system — all variety comes from how the engines are set up for each mission.
The overall feel of the game should resemble classic Flash-era 2D action games, comparable in presentation and gameplay experience to titles like Achilles by Armor Games. The emphasis is on satisfying melee combat, responsive controls, readable combat, and strong visual clarity rather than cutting-edge graphics or cinematic presentation.

2. VISUAL STYLE & PRESENTATION
Overall Style
White Knight is a 2D side-view action game. The art direction uses a semi-realistic medieval style with stylized character proportions rather than pixel art. The visual priority at all times is gameplay clarity over realism.
Key characteristics:
Hand-painted backgrounds with layered parallax scenery
Stylized character proportions with large shields and oversized weapons
Fast, arcade-style combat
Minimal HUD
Clear character silhouettes for easy reading during combat
High gameplay readability at all times
Avoid highly saturated fantasy colors throughout the game, except when representing magical effects. The overall color tone should be warm, earthy, and muted.
Screen Layout
The screen is divided into three vertical zones:
Top 20% — HUD. All interface elements are contained here. The gameplay area below remains uncluttered.
Middle 55% — Environment. This area contains the sky, distant mountains, landscape, and all parallax scenery layers. It should feel expansive and atmospheric.
Bottom 25% — Gameplay Ground. This is where all action takes place. Characters, weapons, and projectiles exist in this zone. The ground should be visually simple so it never distracts from combat.
Background Design
Backgrounds use layered parallax scrolling to create a sense of depth. Each layer scrolls at a different speed. A typical background consists of the following layers from back to front:
Sky gradient
Distant mountains
Hills
Atmospheric fog
Foreground terrain
The environment should feel wide and open despite gameplay remaining strictly 2D.
Ground
The player always stands on a continuous ground surface. The ground material changes depending on the mission environment and may be dirt, grass, sand, stone, or snow. It should have subtle texture variation but remain visually simple to avoid drawing the eye away from combat.
Character Scale & Style
Characters occupy roughly 15–20% of the screen height. They must be large enough that weapons are clearly readable, shields are visible, and attack animations are easy to understand at a glance. The player character should always be the primary visual focus on screen.
Characters should have:
Stylized, slightly exaggerated proportions
Large shields
Oversized weapons
Clear armor silhouettes
Readable helmets
Strong attack poses
Combat Feel
Every attack must communicate force and impact. Combat should feel fast, responsive, weighty, and satisfying. Each hit should be reinforced through a combination of:
Anticipation (wind-up before the attack)
Weapon swing animation
A brief hit pause on impact
Knockback on the enemy
Sound effect
Particle or impact effect
Floaty or weightless combat must be avoided.
Animation
Animations should be exaggerated rather than realistic. Every attack animation has four stages: anticipation, swing, impact, and recovery. Movement should feel responsive and arcade-like, not cinematic or motion-captured.
Lighting & Effects
Use soft directional lighting. Avoid heavy bloom or modern post-processing effects. Magic and spells should be the brightest visual elements on screen at any given moment. Characters must remain clearly visible against the background at all times.
Fonts & HUD Style
Fonts should resemble medieval handwritten or engraved lettering while remaining fully readable during gameplay. The HUD should stay minimal and non-intrusive.
Standard HUD elements:
Top Left: Player name, lives, remaining enemies
Top Center: Kill counter
Top Right: Mission, stage, and level indicator
During boss fights, a large boss health bar is displayed prominently on screen.

3. CAMERA
Type
Orthographic camera with a fixed side view. The camera always looks perpendicular to the gameplay plane and never rotates.
Behavior
The camera follows the player smoothly along the horizontal axis. Vertical movement is limited. The camera should never zoom dramatically.
A small dead zone is present — the camera does not begin moving immediately when the player moves, giving the view a stable, cinematic feel rather than constantly snapping to the player's position.
The camera keeps both the player and nearby enemies visible whenever possible. Camera movement should feel stable rather than erratic.
Gameplay Plane
All movement happens on a single horizontal plane. The player can move left, right, and jump. There is no movement into or out of the screen. Enemies exist on the same combat plane as the player. This is not a beat-em-up with multiple movement lanes.

4. THE THREE GAMEPLAY ENGINES
Engine A — Open Field Battle
The player controls a commander character on a large battlefield. The commander leads an army made up of cavalry units and infantry units. The enemy side also has commanders leading their own cavalry and infantry.
The goal is to defeat the enemy commanders while keeping the player's commander alive. The player can move their commander around the battlefield and issue orders to their units: move to a position, charge, hold position, or retreat. Units attack the nearest enemy automatically.
When a unit dies, the body remains briefly and then disappears.
This engine is used in: Mission 1, Mission 12.

Engine B — Quest / Journey
The player travels through a sequence of sections called Slides. Each slide is a self-contained stage with its own background environment, enemies, and hazards. The player moves through the slides one after another, with difficulty increasing as they progress. The typical structure is three slides followed by a boss fight, though some missions have no boss.
Movement is free using the keyboard (WASD). The camera scrolls as the player advances along the horizontal level. Gameplay occurs on long horizontal levels. The player continuously progresses toward the objective. Levels contain enemy encounters, environmental hazards, obstacles, and boss arenas at the end. Maze-like layouts are not used.
Each slide contains enemy waves that the player must defeat before advancing. Typical wave scaling:
Wave 1: 5 enemies
Wave 2: 10 enemies
Wave 3: 15 enemies
Some missions use a flying creature called a Hippogryph as the player's mount. In these missions the player flies through aerial environments instead of travelling on the ground. Vertical movement is available. The mission ends when the player lands safely at the destination rather than defeating a boss.
This engine is used in: Missions 3, 4, 5, 6, 8, 9, 10, 11, 14 (journey portion of each).

Engine C — Duel (1v1 Combat)
Two characters fight each other in an arena. Both have visible health bars. The player attacks, blocks, and dodges until one fighter's health reaches zero.
Duels are divided into rounds. Each round can have different rules — mounted on horseback, on foot, or on foot without helmets. The number of rounds and their conditions are defined per mission. When a round ends, the next begins under the new conditions.
Mounted phase: Both fighters start on horseback. When a character's health drops sufficiently, the horses are removed and the fight continues on foot. Helmet removal happens at the start of a designated round.
Some duels follow special rules instead of standard combat. These are described in the Boss Fights section.
This engine is used in: Missions 2, 3 (boss), 4 (boss), 5 (boss), 6 (final duel), 7, 8 (boss), 10 (bosses), 11 (boss), 13, 15.

5. CONTROLS
These controls apply across all three engines unless otherwise noted.
Action
Input
Move
WASD
Dodge
Space
Block / Shield
Shift
Interact
E
Light Attack
Left Mouse Button
Heavy Attack
Right Mouse Button

Dodging gives the player a brief window of invincibility. It has a short cooldown. The player cannot dodge while blocking.
Blocking raises the player's shield. This stops most physical projectiles (arrows, spears, javelins). It does not stop magic projectiles or fireballs. The player cannot block while dodging. A heavy attack from an enemy can break a block and briefly stagger the player.
Engine A additional controls:
Action
Input
Issue Move order to selected unit
Q
Issue Hold Position order
R
Issue Retreat order
F
Issue Charge order
Middle Mouse Button
Cycle unit selection
Tab


6. COMBAT & HEALTH
Health Values
Character
Health (On Foot)
Health (Mounted)
Player (Main Character)
100 HP — displayed as 4 blocks
~150 HP — displayed as 6 blocks
Typical Unit
75 HP — displayed as 3 blocks
~125 HP — displayed as 5 blocks

Health is shown as a segmented horizontal bar. More segments are shown when mounted. Boss health bars are displayed separately and prominently on screen during boss fights.
Damage Values
Attack
Damage
Light Attack
10
Heavy Attack
25
Arrow
5
Spear
15
Boss Attack
35

Unit Death
When a unit dies, the body stays on the ground briefly and then disappears after a short time.

7. CHARACTERS
Playable Characters
Name
Alias / Notes
White Knight
Main Character. Primary protagonist throughout the campaign.
Bronze Knight
Goes by "Brown Feather." Joins the player as an ally after Mission 4. Playable in Mission 6.
Saracen Lieutenant
Goes by "Green Chestnut." Playable in Mission 11.
Cordova Boss
Known as the Black Knight. Main antagonist of Mission 3 and Mission 15.
Saracen Leader 1
Available as a playable character.
Saracen Leader 2
Available as a playable character.
Pink Paladin
Tournament fighter.
Red Paladin
Tournament fighter.
Blue Paladin (Oliver)
Tournament fighter.
Deer Paladin (Renault)
Tournament fighter.
Orange Paladin
Tournament fighter.
Yellow Paladin
Tournament fighter.
Emperor Knight
Unlocked by achieving a high score.


8. ENEMY TYPES
Enemy
Appears In
Infantry
Missions 1, 3, 4, 12, 14
Archers
Missions 3, 4, 6 (enemy ships), 11 (foreign cities), 14
Cavalry
Missions 1, 12
Spearmen
Missions 3, 4, 14
Bandits
Missions 8, 14
Ghosts
Mission 5
Zombies
Missions 5, 10
Servants
Missions 5, 10
Wizards
Missions 4 (boss), 5 (boss)
Witches
Missions 8 (boss), 10 (extra boss)
Vikings / Northmen
Mission 8
Wild Animals
Missions 8, 14
Balkan Soldiers
Mission 14
Swamp Troll
Mission 11 (boss)


9. HAZARDS & PROJECTILES
Hazards appear during Quest/Journey missions and vary by mission. The following table lists each hazard, how much damage it deals, whether the player's shield can block it, and which missions it appears in.
Hazard
Damage
Blockable by Shield
Missions
Arrows
5
Yes
3, 4, 6
Spears
15
Yes
3, 4
Javelins
15
Yes
3, 4
Traps
20
No
5, 9, 10
Falling Objects
15
No
5, 9, 10
Wind Gusts
No damage — pushes player
No
6, 9, 11
Storms
10
No
6, 9, 11
Magic Projectiles
25
No
5, 8, 10
Birds (aerial)
10
No
9, 11
Fortress Projectiles
15
Yes
9
Foreign City Projectiles
15
Yes
11

All hazards can be avoided by dodging. The shield only blocks the hazards listed as blockable above.

10. MISSION CAMPAIGN — ALL 15 MISSIONS
The campaign is strictly linear. Missions unlock one at a time in order. The player cannot skip ahead.

Mission 1 — Open Field Battle
Engine: Open Field Battle
The kingdom's army engages an enemy force in a forest region. The player controls the White Knight commander and leads their army against the enemy forces.
Objective: Defeat all enemy commanders.
Environment: Forest.
Enemies: Infantry, Cavalry, Archers.
Outcome: Leads directly into Mission 2.

Mission 2 — Commander Duel
Engine: Duel
After the battle from Mission 1, the defeated enemy commander challenges the player to single combat.
Objective: Defeat the enemy commander in a two-round duel.
Round 1: Both fighters are mounted on horses.
Round 2: Both fighters are on foot without helmets.
Outcome: Leads into Mission 3.

Mission 3 — Quest to Cordova
Engine: Quest / Journey followed by a Boss Duel
The player travels through three environments, fighting through increasingly large enemy waves.
Environments: Forest → Mountains → City Gate / Bridge.
Hazards: Arrows, Spears, Javelins.
Enemies: Archers, Spearmen, Infantry.
Wave sizes: 5 enemies → 10 enemies → 15 enemies.
Boss Fight: The Enemy Leader (Black Knight). Three-round duel.
Round 1: Mounted on horses.
Round 2: On foot.
Round 3: On foot without helmets.
After the boss's health drops by at least two blocks, the boss dismounts and the fight continues on foot.
Reward: The player receives important information needed for the next mission.

Mission 4 — Quest to the Wizard Tower
Engine: Quest / Journey followed by a Boss Duel
The player fights through enemy forces toward a dark tower.
Environments: Mountains → Coastline → Dark Tower Exterior.
Hazards: Arrows, Spears, Javelins.
Enemies: Archers, Spearmen, Infantry.
Boss Fight: The Mysterious Knight, who is mounted for the entire fight. One round only. The boss uses magic beams, fireballs, and summons ghosts as attacks.
Outcome: After being defeated, the Mysterious Knight joins the player as an ally.

Mission 5 — Overcoming the Shadows
Engine: Quest / Journey followed by a Boss Duel
The player fights through a dark tower's interior to rescue an imprisoned ally.
Environments: Dark Hallway → Shadow Mirror Hall → Grand Hall.
Hazards: Traps, Falling Objects, Magic Projectiles.
Enemies: Ghosts, Zombies, Servants.
Boss Fight: The Wizard. One round with special rules.
The player does not attack the Wizard directly. Instead, the player must withhold and dodge the Wizard's attacks and magic beams. The Wizard has a Mana Bar alongside his health bar. Every spell the Wizard casts drains his own mana. When the Mana Bar reaches zero, the Wizard quits the fight.
The Wizard's attacks become more dangerous as his mana depletes — progressing through fireballs, summoning ghosts, and eventually distorting the terrain and using haunted trees.
Outcome: The imprisoned ally is rescued.

Mission 6 — Voyage Home
Engine: Quest / Journey followed by a Duel
Playable Character: The Mysterious Knight (not the White Knight).
The player travels by sea from the dark tower's coast back to Europe.
Environments: Dark Tower Coast → Open Sea → European Coast.
Hazards: Enemy ships, weather, waves, projectiles (arrows), wind gusts, storms.
Enemies: Archers firing from enemy ships.
Final Duel: The Mysterious Knight fights a Paladin. Two rounds.
Round 1: On foot.
Round 2: On foot without helmets.

Mission 7 — Training Grounds
Engine: Duel
A training tournament with no story. The player freely selects which character they want to play and which opponent to fight. Any of the 8 champions in the roster can be chosen. The player can choose to fight mounted on horseback or on foot. Each bout is one round.
This mission is always accessible from the main menu once unlocked.

Mission 8 — Search for the Sacred Herb
Engine: Quest / Journey followed by a Boss Duel
The player searches for a sacred herb through a series of outdoor environments.
Environments: Forest → Lake → Ancient Stone Grounds.
Hazards: Traps.
Enemies: Bandits, Wild Animals, Vikings (Northmen).
Boss Fight: The Witch Spirit. One round. The Witch uses magic projectiles and stun spells. At lower health she summons zombie reinforcements. A stun spell briefly locks the player's movement.
Reward: The Sacred Herb is obtained.

Mission 9 — Flight to the Fortress
Engine: Quest / Journey — no boss duel.
Mount: The player rides a Hippogryph (a flying creature) through the entire mission. This replaces ground movement with aerial movement. Vertical movement is available.
Environments: Continental Sky → Storm Zone → Enemy Fortress Airspace.
Hazards: Birds, Wind Gusts, Storms, Fortress Projectiles.
Enemies: None. This is a hazard-only mission.
Win Condition: The player must land safely on the fortress walls while dodging enemy projectiles. There is no boss fight.

Mission 10 — Breaking the Curse
Engine: Quest / Journey followed by two boss fights.
The player fights through a fortress to break a curse.
Environments: Fortress Walls → Fortress Hallways → Fortress Dungeon.
Hazards: Traps, Falling Objects, Magic Projectiles.
Enemies: Servants, Zombies.
Boss Fight 1: A Bewitched Ally. One round of standard duel combat. Defeating this ally breaks the curse.
Boss Fight 2 (Extra Boss): The Evil Witch. This is a tag-team 2v1 fight. Two allied characters take on the Witch together, but only one can fight at a time.
When the active ally is hit by the Witch's stun spell, that ally is temporarily unable to fight and the other ally tags in to continue the battle. The Witch has a Mana Bar. The fight continues, with allies swapping in and out whenever one is stunned, until the Witch's Mana Bar reaches zero and she quits.

Mission 11 — Return Home
Engine: Quest / Journey followed by a Boss Duel.
Playable Character: Green Chestnut (the Saracen Ally).
Mount: Hippogryph (aerial travel).
Environments: Flight above the Ocean → Continental Sky → Landing to the Correct Coast.
Hazards: Birds, Winds, Storms, Foreign City Projectiles.
Enemies: Archers (from foreign cities below).
Boss Fight: The Swamp Troll. One round. The Troll is a large monster with a big health bar. Green Chestnut fights to save a young lady. The Troll fights on foot — there is no mounted phase.

Mission 12 — Mercenary Battle
Engine: Open Field Battle.
The White Knight, fighting as a Rogue Paladin, takes part in a battle for a neighboring kingdom.
Objective: Win the battle.
Outcome: After the battle, the enemy leader approaches the player with an offer.

Mission 13 — Emperor's Champion
Engine: Duel.
The player fights while disguised as the Emperor. The opponent is the White Knight (the Main Character, now on the opposing side).
Rounds: Two.
Round 1: Mounted.
Round 2: On foot.

Mission 14 — The White Knight
Engine: Quest / Journey — no boss duel.
The White Knight travels through Eastern European territory.
Environments: Balkan Forest → Valachia Mountains → German Fields.
Hazards: Bandits, Wild Animals, Enemy Soldiers.
Enemies: Bandits, Wild Animals, Balkan Soldiers, Archers, Spearmen, Infantry.
No boss fight.
Outcome: Green Chestnut Paladin is accepted into the Duke's Court and the planned marriage is allowed to proceed.

Mission 15 — Final Battle
Engine: Duel.
The villain from Mission 3 (the Black Knight) attacks during the wedding ceremony. The White Knight fights him in the final confrontation.
Rounds: Three.
Round 1: Mounted on horses.
Round 2: On foot.
Round 3: On foot without helmets.
Outcome: The villain is defeated permanently. The campaign is complete.

11. BOSS FIGHTS
Each boss fight occurs at the end of a Quest/Journey mission or as a standalone Duel mission. Below is a summary of every boss, their fight structure, and their special rules.

Mission 2 — Enemy Commander
A standard two-round duel. Round 1 is mounted. Round 2 is on foot without helmets. No special mechanics.

Mission 3 — Black Knight (Enemy Leader)
A three-round duel. Mounted → On Foot → No Helmets. The transition from mounted to foot happens when the boss's health drops by at least two blocks. No special mechanics beyond round transitions.

Mission 4 — Mysterious Knight
A single-round mounted fight. The boss uses three attack types across the fight: magic beams, fireballs, and ghost summoning. The ghost summoning spawns additional ghost enemies into the arena during the fight. The boss remains mounted for the entire duel.

Mission 5 — The Wizard
Special rules — the player does not attack the Wizard directly.
The Wizard has both a health bar and a Mana Bar. The player's goal is to survive and dodge the Wizard's attacks. Each spell the Wizard casts depletes his own mana. When mana reaches zero, the Wizard quits.
The Wizard's attacks become more dangerous as his mana depletes:
At high mana: fireballs and magic beams.
At medium mana: summons ghost enemies.
At low mana: distorts the terrain (the arena shakes and deforms) and uses haunted trees.

Mission 8 — Witch Spirit
One round. The Witch uses magic projectiles and stun spells. A stun briefly locks the player's movement. At lower health she summons zombie reinforcements into the arena. At very low health she distorts the terrain.

Mission 10 (Primary) — Bewitched Ally
One round of standard duel combat. No special mechanics. Defeating the ally breaks the curse on them.

Mission 10 (Extra) — Evil Witch (Tag-Team 2v1)
Special rules — two allies fight one Witch in a tag format.
Two allied characters are both present, but only one fights at a time. The Witch has a Mana Bar. When the active ally is struck by the Witch's stun spell, that ally cannot fight temporarily, and the other ally immediately takes over. The fight continues with allies swapping in and out as stuns occur. When the Witch's Mana Bar reaches zero, she quits the fight.

Mission 11 — Swamp Troll
One round. The Troll is a large creature with a very large health bar. There is no mounted phase. Green Chestnut Paladin fights the Troll on foot to rescue a young lady. Standard combat mechanics apply.

Mission 13 — White Knight (as opponent)
A two-round duel. Mounted in Round 1, on foot in Round 2. The Main Character appears here as the opponent. No special mechanics.

Mission 15 — Black Knight (Final)
A three-round duel. Mounted → On Foot → No Helmets. This is the same opponent as Mission 3 but serves as the final boss of the campaign. No special mechanics beyond round transitions.

12. VICTORY & FAILURE CONDITIONS
Open Field Battle (Engine A)
Result
Condition
Victory
All enemy commanders are defeated or have routed
Failure
The player's commander dies
Failure
The player's army is entirely destroyed

Quest / Journey (Engine B)
Result
Condition
Victory
The player reaches the end of the final slide and defeats the boss (if one is present)
Victory (Missions 9 & 11)
The player lands safely at the destination
Failure
Player health reaches zero
Failure
An escort target dies (where applicable)

Duel (Engine C)
Result
Condition
Victory
The opponent's health reaches zero
Victory (Wizard / Witch bosses)
The opponent's Mana Bar reaches zero
Failure
Player health reaches zero


13. PROGRESSION & SAVING
The campaign follows a strict linear structure. Missions unlock one at a time in order. The player cannot access a later mission without completing the previous one.
Saving: The game saves automatically when a mission is completed and when a mission begins. When the player selects Continue from the main menu, they resume from the last mission they reached.
Mission 7 (Training Grounds) is always accessible from the main menu once it has been unlocked, regardless of the player's current campaign progress.
Emperor Knight is a special character unlocked by achieving a high score. This unlock is tracked separately from story progression.

14. CORE DESIGN RULES
These rules define how the game must be built at a fundamental level.
Only three gameplay engines exist. Open Field Battle, Quest/Journey, and Duel. Every mission is a version of one of these engines.


No mission has its own unique gameplay code. All differences between missions — environments, enemies, hazards, bosses, story text, characters, round rules — are configurations applied to the existing engines.


Character switching between missions is handled by configuration. When a mission uses a different playable character (such as the Mysterious Knight in Mission 6 or Green Chestnut in Mission 11), this is set as part of that mission's setup, not a separate system.


Boss fights that occur after a Journey mission are the final section of that journey. They are not separate modes — the boss arena is simply the last slide of the quest, transitioning into a duel.


The three engines must be reusable and accept any valid configuration. The Quest engine must be capable of handling ground travel and aerial Hippogryph travel, all hazard combinations, and quests with or without a final boss, without any mission-specific code.


Visual clarity is a design constraint, not a preference. Character scale, camera behavior, screen layout, and background design must all serve the goal of keeping combat immediately readable at all times.



End of White Knight Game Design Document


