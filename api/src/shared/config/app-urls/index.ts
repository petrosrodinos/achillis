// Client links used in emails (contracts §2.7). `appUrl` comes from the APP_URL env var.
export const AppUrls = {
  verifyEmail: (appUrl: string, token: string) =>
    `${appUrl}/verify-email?token=${encodeURIComponent(token)}`,
  resetPassword: (appUrl: string, token: string) =>
    `${appUrl}/reset-password?token=${encodeURIComponent(token)}`,
} as const;
