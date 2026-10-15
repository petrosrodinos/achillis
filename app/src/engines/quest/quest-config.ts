import { z } from 'zod';
import { ENV_IDS, GROUND_MATERIALS } from '@/content/ids';
import { ArenaSchema, DuelConfigBaseSchema, DuelConfigSchema, FighterRefSchema } from '@/engines/duel/duel-config';

export const EnemyLookSchema = z.enum([
  'infantry', 'spearman', 'archer', 'cavalry', 'bandit', 'viking', 'balkan-soldier', 'wolf', 'boar',
  'ghost', 'zombie', 'servant', 'ship-archer', 'city-archer',
]);

export const WaveSchema = z.object({
  count: z.number().int().min(1).max(40),
  enemies: z.array(z.object({ look: EnemyLookSchema, weight: z.number().positive().default(1) })).min(1),
  /** Max enemies alive at once (readability). */
  maxAlive: z.number().int().min(1).max(10).default(4),
  from: z.enum(['right', 'left', 'both']).default('both'),
  /** Where along the slide (0..1) the wave triggers. Defaults are spread evenly. */
  triggerAt: z.number().min(0).max(1).optional(),
});

export const HazardSpawnSchema = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('spike-traps'), count: z.number().int().min(1).max(20) }),
  z.object({ kind: z.literal('falling-objects'), every: z.number().positive(), model: z.enum(['rock', 'chandelier', 'beam', 'boulder']).default('rock') }),
  z.object({ kind: z.literal('wind-gusts'), every: z.number().positive(), power: z.number().positive().default(14), variant: z.enum(['wind', 'wave']).default('wind') }),
  z.object({ kind: z.literal('storms'), every: z.number().positive() }),
  z.object({ kind: z.literal('projectiles'), every: z.number().positive(), projectile: z.enum(['arrow', 'spear', 'javelin', 'magic', 'fortress-shot', 'city-shot', 'rock']), origin: z.enum(['right', 'left', 'below', 'above']).default('right') }),
  z.object({ kind: z.literal('ships'), count: z.number().int().min(1).max(6) }),
  z.object({ kind: z.literal('birds'), every: z.number().positive() }),
]);

const SlideBase = {
  title: z.string(),
  env: z.enum(ENV_IDS),
  fog: z.enum(['light', 'dark', 'storm']).default('light'),
  music: z.string().optional(),
  ambience: z.string().nullable().optional(),
};

export const GroundSlideSchema = z.object({
  kind: z.literal('ground'),
  ...SlideBase,
  ground: z.enum(GROUND_MATERIALS),
  length: z.number().min(30).max(200).default(70),
  waves: z.array(WaveSchema).default([]),
  hazards: z.array(HazardSpawnSchema).default([]),
});

export const FlightSlideSchema = z.object({
  kind: z.literal('flight'),
  ...SlideBase,
  length: z.number().min(60).max(400).default(150),
  hazards: z.array(HazardSpawnSchema).default([]),
  /** Final flight slide: land safely on a platform at the end (spec §15). */
  landing: z.object({ width: z.number().min(4).max(20).default(9), height: z.number().min(0).max(8).default(3), label: z.string().default('Landing zone') }).optional(),
  /** Visible ground band in flight: sea or clouds. */
  surface: z.enum(['sea', 'clouds', 'land']).default('clouds'),
});

export const BossSlideSchema = z.object({
  kind: z.literal('boss'),
  title: z.string(),
  arena: ArenaSchema,
  duel: DuelConfigBaseSchema.omit({ arena: true, player: true }),
});

export const SlideSchema = z.discriminatedUnion('kind', [GroundSlideSchema, FlightSlideSchema, BossSlideSchema]);

export const QuestConfigSchema = z
  .object({
    playable: FighterRefSchema,
    mount: z.enum(['none', 'hippogryph']).default('none'),
    allies: z.array(FighterRefSchema).max(2).default([]),
    escort: z.object({ character: FighterRefSchema, name: z.string() }).optional(),
    slides: z.array(SlideSchema).min(1).max(8),
    music: z.string().default('battle'),
  })
  .superRefine((cfg, ctx) => {
    let seenBoss = false;
    cfg.slides.forEach((s, i) => {
      if (s.kind === 'boss') seenBoss = true;
      else if (seenBoss) ctx.addIssue({ code: 'custom', message: 'Boss slides must be the last slides of a quest', path: ['slides', i] });
      if (s.kind === 'flight' && cfg.mount !== 'hippogryph') ctx.addIssue({ code: 'custom', message: 'Flight slides require the hippogryph mount', path: ['slides', i] });
      if (s.kind === 'flight' && s.landing && cfg.slides[i + 1]?.kind === 'flight') ctx.addIssue({ code: 'custom', message: 'Only the last flight slide may have a landing zone', path: ['slides', i] });
      if (s.kind === 'boss') {
        const r = DuelConfigSchema.safeParse({ ...s.duel, arena: s.arena, player: { character: cfg.playable } });
        if (!r.success) ctx.addIssue({ code: 'custom', message: `Invalid boss duel: ${r.error.issues[0]?.message}`, path: ['slides', i, 'duel'] });
      }
    });
    const flights = cfg.slides.filter((s) => s.kind === 'flight');
    if (flights.length > 0 && !flights.some((s) => s.kind === 'flight' && s.landing)) {
      ctx.addIssue({ code: 'custom', message: 'Flight quests must end the flight with a landing zone', path: ['slides'] });
    }
    if (cfg.escort && cfg.mount === 'hippogryph') ctx.addIssue({ code: 'custom', message: 'Escorts are not supported in flight', path: ['escort'] });
  });

export type QuestConfig = z.infer<typeof QuestConfigSchema>;
export type QuestConfigInput = z.input<typeof QuestConfigSchema>;
export type SlideConfig = z.infer<typeof SlideSchema>;
export type GroundSlide = z.infer<typeof GroundSlideSchema>;
export type FlightSlide = z.infer<typeof FlightSlideSchema>;
export type BossSlide = z.infer<typeof BossSlideSchema>;
export type WaveConfig = z.infer<typeof WaveSchema>;
export type HazardSpawn = z.infer<typeof HazardSpawnSchema>;
