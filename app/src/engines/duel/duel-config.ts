import { z } from 'zod';
import { CHARACTER_IDS, ENV_IDS, GROUND_MATERIALS, STORY_SKIN_IDS } from '@/content/ids';

export const FighterRefSchema = z.enum([...CHARACTER_IDS, ...STORY_SKIN_IDS]);
export const BossRefSchema = z.enum(['black-knight', 'mysterious-knight', 'wizard', 'witch-spirit', 'evil-witch', 'swamp-troll']);
export const BossModuleIdSchema = z.enum(['mysterious-knight', 'wizard', 'witch-spirit', 'evil-witch']);

export const RoundSchema = z.object({
  label: z.string().optional(),
  mount: z.enum(['horse', 'none']),
  helmets: z.boolean(),
  /** 'ko' ends at zero HP; hpAtOrBelow ends the round when either fighter falls to that HP. */
  endsWhen: z.discriminatedUnion('type', [
    z.object({ type: z.literal('ko') }),
    z.object({ type: z.literal('hpAtOrBelow'), hp: z.number().positive() }),
  ]),
});

export const ArenaSchema = z.object({
  env: z.enum(ENV_IDS),
  ground: z.enum(GROUND_MATERIALS),
  fog: z.enum(['light', 'dark', 'storm']).default('light'),
  width: z.number().min(14).max(60).default(26),
  music: z.string().default('duel'),
  ambience: z.string().nullable().default(null),
});

export const DuelConfigBaseSchema = z.object({
    arena: ArenaSchema,
    player: z.object({ character: FighterRefSchema }),
    opponent: z.object({
      ref: z.union([FighterRefSchema, BossRefSchema]),
      name: z.string().optional(),
      /** Multiplies the opponent's HP pool (Swamp Troll's very large bar is in its archetype). */
      hpScale: z.number().positive().default(1),
      isBoss: z.boolean().default(false),
    }),
    rounds: z.array(RoundSchema).min(1).max(5),
    boss: z.object({ module: BossModuleIdSchema }).optional(),
    /** Tag-team: a second ally the player can switch to (Evil Witch). */
    tagTeam: z.object({ partner: FighterRefSchema }).optional(),
    victory: z.enum(['ko', 'mana']).default('ko'),
    /** Story line shown at duel start (e.g. boss taunt). */
    intro: z.object({ speaker: z.string(), text: z.string() }).optional(),
  });

export const DuelConfigSchema = DuelConfigBaseSchema.superRefine((cfg, ctx) => {
    const last = cfg.rounds[cfg.rounds.length - 1];
    if (cfg.victory === 'ko' && last.endsWhen.type !== 'ko') {
      ctx.addIssue({ code: 'custom', message: 'The final round of a KO duel must end on KO', path: ['rounds'] });
    }
    cfg.rounds.slice(0, -1).forEach((r, i) => {
      if (r.endsWhen.type === 'ko') ctx.addIssue({ code: 'custom', message: `Round ${i + 1} ends on KO but is not the last round`, path: ['rounds', i] });
    });
    if (cfg.victory === 'mana' && !cfg.boss) ctx.addIssue({ code: 'custom', message: 'Mana victory requires a boss module', path: ['victory'] });
  });

export type DuelConfig = z.infer<typeof DuelConfigSchema>;
export type DuelConfigInput = z.input<typeof DuelConfigSchema>;
export type RoundConfig = z.infer<typeof RoundSchema>;
export type FighterRef = z.infer<typeof FighterRefSchema>;
export type BossRef = z.infer<typeof BossRefSchema>;
export type BossModuleId = z.infer<typeof BossModuleIdSchema>;
