import { z } from 'zod';
import { MISSION_IDS } from '@/shared/constants/game.constants';

const positiveInt = (fallback: number, max?: number) =>
  z
    .string()
    .optional()
    .transform((value) =>
      value === undefined || value === '' ? fallback : Number(value),
    )
    .pipe(max ? z.number().int().min(1).max(max) : z.number().int().min(1));

export const LeaderboardQuerySchema = z
  .object({
    scope: z.enum(['global', 'mission']).default('global'),
    missionId: z.enum(MISSION_IDS).optional(),
    window: z.enum(['all', 'monthly', 'weekly']).default('all'),
    sort: z.enum(['points', 'time']).default('points'),
    page: positiveInt(1),
    limit: positiveInt(20, 100),
  })
  .superRefine((query, ctx) => {
    if (query.scope === 'mission' && !query.missionId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['missionId'],
        message: 'missionId is required for scope=mission',
      });
    }
    if (query.scope === 'global' && query.sort === 'time') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['sort'],
        message: 'sort=time is only valid for scope=mission',
      });
    }
  });

export type LeaderboardQueryType = z.infer<typeof LeaderboardQuerySchema>;
