// Per-IP rate limits (contracts §2.6). Used with @nestjs/throttler's @Throttle({ default: ... }).
const MINUTE = 60_000;
const HOUR = 60 * MINUTE;

export const RateLimits = {
  default: { limit: 120, ttl: MINUTE },
  register: { default: { limit: 5, ttl: HOUR } },
  login: { default: { limit: 10, ttl: MINUTE } },
  forgotPassword: { default: { limit: 5, ttl: HOUR } },
  resetPassword: { default: { limit: 10, ttl: HOUR } },
  refresh: { default: { limit: 60, ttl: MINUTE } },
  missionComplete: { default: { limit: 20, ttl: MINUTE } },
  telemetry: { default: { limit: 20, ttl: MINUTE } },
} as const;
