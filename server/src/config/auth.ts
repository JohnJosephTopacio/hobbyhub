export const authConfig = {
  accessTokenTtlSeconds: 15 * 60,
  refreshTokenTtlSeconds: 15 * 24 * 60 * 60,
  sessionTtlSeconds: 30 * 24 * 60 * 60,
} as const;
