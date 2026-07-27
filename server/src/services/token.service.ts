import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

type UUID = `${string}-${string}-${string}-${string}-${string}`;

export async function createRefreshToken(userId: number, jti: UUID) {
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

export async function createAccessToken(userId: number) {
  return jwt.sign({ sub: userId }, env.JWT_ACCESS_SECRET, {
    expiresIn: '5m',
  });
}
