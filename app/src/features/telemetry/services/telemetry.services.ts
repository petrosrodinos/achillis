import { api } from '@/api/client';

export interface ClientErrorDto {
  message: string;
  stack?: string;
  url: string;
  userAgent: string;
  context?: Record<string, unknown>;
}

/** `/telemetry` endpoints (contracts §2.5). */
export const telemetryApi = {
  clientError: (dto: ClientErrorDto) => api.post<void>('/telemetry/client-error', dto, { refreshOn401: false, retries: 0 }),
};
