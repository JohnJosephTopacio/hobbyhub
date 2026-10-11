import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { authConfig } from '../config/auth.js';

type UUID = `${string}-${string}-${string}-${string}-${string}`;

export function createRefreshToken(userId: string, jti: UUID, expiryInMs?: number) {
  let expiryInSeconds;
  if (expiryInMs !== undefined) {
    expiryInSeconds = Math.floor(expiryInMs / 1000);
  }

  return jwt.sign(
    {
      sub: userId,
      jti,
    },
    env.JWT_REFRESH_SECRET,
    {
      expiresIn: expiryInSeconds ?? authConfig.refreshTokenTtlSeconds,
    },
  );
}

export function createAccessToken(userId: string) {
  return jwt.sign({ sub: userId }, env.JWT_ACCESS_SECRET, {
    expiresIn: authConfig.accessTokenTtlSeconds,
  });
}
