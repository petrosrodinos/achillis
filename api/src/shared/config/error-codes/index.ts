export const ErrorMessages = {
  Auth: {
    INVALID_CREDENTIALS: 'Invalid credentials',
    EMAIL_TAKEN: 'Email is already registered',
    USERNAME_TAKEN: 'Username is already taken',
    USERNAME_NOT_ALLOWED: 'Username is not allowed',
    INVALID_REFRESH_TOKEN: 'Invalid refresh token',
    INVALID_VERIFICATION_TOKEN: 'Invalid or expired verification token',
    INVALID_RESET_TOKEN: 'Invalid or expired reset token',
    AUTHENTICATION_REQUIRED: 'Authentication required',
    CSRF_HEADER_MISSING: 'Missing X-Requested-With header',
  },
  Progress: {
    MISSION_LOCKED: 'Mission is locked',
    UNKNOWN_MISSION: 'Unknown mission',
    INVALID_RUN_TOKEN: 'Invalid or expired run token',
    RUN_ALREADY_COMPLETED: 'Run has already been submitted',
    IMPLAUSIBLE_RESULT: 'Mission result rejected',
  },
} as const;
