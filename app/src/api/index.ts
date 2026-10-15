/** Typed API surface. The game page should use `progressApi.missionStart` and `submitMissionResult`. */
export { api, createApiClient, API_BASE_URL, type ApiClient, type RequestOptions } from './client';
export { ApiError, isApiError, isRetryableError, errorMessage, fieldErrorsFrom } from './errors';
export { outbox, submitMissionResult, isQueued, type SubmitOutcome, type OutboxEvent } from './outbox';
export { queryKeys } from './query-keys';
export { authApi } from '@/features/auth/services/auth.services';
export { meApi } from '@/features/me/services/me.services';
export { progressApi } from '@/features/progress/services/progress.services';
export { leaderboardApi } from '@/features/leaderboard/services/leaderboard.services';
export { telemetryApi } from '@/features/telemetry/services/telemetry.services';
export type * from './types';
