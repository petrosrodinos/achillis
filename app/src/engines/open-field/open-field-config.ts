import { z } from 'zod';
import { ENV_IDS, GROUND_MATERIALS } from '@/content/ids';
import { FighterRefSchema } from '@/engines/duel/duel-config';

export const UnitLookSchema = z.enum(['infantry', 'spearman', 'archer', 'cavalry']);

export const SquadSchema = z.object({
  name: z.string(),
  look: UnitLookSchema,
  count: z.number().int().min(1).max(20),
});

export const OpenFieldConfigSchema = z
  .object({
    env: z.enum(ENV_IDS),
    ground: z.enum(GROUND_MATERIALS),
    fog: z.enum(['light', 'dark', 'storm']).default('light'),
    /** Battlefield length in metres. */
    width: z.number().min(60).max(260).default(130),
    music: z.string().default('battle'),
    ambience: z.string().nullable().default('amb-battle'),
    player: z.object({ character: FighterRefSchema, title: z.string().default('Commander') }),
    playerSquads: z.array(SquadSchema).min(1).max(6),
    enemyCommanders: z
      .array(
        z.object({
          name: z.string(),
          character: FighterRefSchema,
          mounted: z.boolean().default(true),
          /** 0..1 position along the field. */
          position: z.number().min(0.5).max(1).default(0.85),
          squads: z.array(SquadSchema).min(1).max(4),
          /** Squad strength fraction at which the commander may rout. */
          routAt: z.number().min(0).max(0.9).default(0.25),
        }),
      )
      .min(1)
      .max(4),
  })
  .superRefine((cfg, ctx) => {
    const total = cfg.playerSquads.reduce((s, q) => s + q.count, 0) + cfg.enemyCommanders.reduce((s, c) => s + c.squads.reduce((a, q) => a + q.count, 0), 0);
    if (total > 120) ctx.addIssue({ code: 'custom', message: `Too many units (${total}); keep battles under 120 units for 60 FPS`, path: ['playerSquads'] });
  });

export type OpenFieldConfig = z.infer<typeof OpenFieldConfigSchema>;
export type OpenFieldConfigInput = z.input<typeof OpenFieldConfigSchema>;
