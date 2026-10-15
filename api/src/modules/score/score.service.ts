import {
  Injectable,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';
import type { MissionCatalogEntry } from '@/modules/progress/config/missions.catalog';
import { ErrorMessages } from '@/shared/config/error-codes';
import { MissionResultInput, ScoreResult } from './interfaces/score.interface';
import { checkPlausibility, computeScore } from './utils/score.utils';

@Injectable()
export class ScoreService {
  private readonly logger = new Logger(ScoreService.name);

  /** Throws 422 (and logs) when the submitted run is implausible. */
  assertPlausible(
    context: { userId: string; runId: string },
    mission: MissionCatalogEntry,
    result: MissionResultInput,
    serverElapsedMs: number,
  ): void {
    const violations = checkPlausibility(mission, result, serverElapsedMs);
    if (violations.length > 0) {
      this.logger.warn(
        `Rejected run ${context.runId} (user ${context.userId}, ${mission.id}, ${result.outcome}): ${violations.join('; ')}`,
      );
      throw new UnprocessableEntityException({
        statusCode: 422,
        error: 'Unprocessable Entity',
        message: ErrorMessages.Progress.IMPLAUSIBLE_RESULT,
      });
    }
  }

  score(
    mission: MissionCatalogEntry,
    result: MissionResultInput,
    firstClear: boolean,
  ): ScoreResult {
    return computeScore(mission, result, { firstClear });
  }
}
