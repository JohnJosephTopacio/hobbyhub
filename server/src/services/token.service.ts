import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

type UUID = `${string}-${string}-${string}-${string}-${string}`;

export function createRefreshToken(userId: string, jti: UUID) {
  return jwt.sign(
    {
      sub: userId,
      jti,
    },
    env.JWT_REFRESH_SECRET,
    {
      expiresIn: '15d',
    },
  );
}

export function createAccessToken(userId: string) {
  return jwt.sign({ sub: userId }, env.JWT_ACCESS_SECRET, {
    expiresIn: '5m',
  });
}
