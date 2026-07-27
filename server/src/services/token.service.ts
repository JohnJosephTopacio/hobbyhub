import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export async function createRefreshToken(userId: number) {
  // JTI means JWT ID
  const jti = crypto.randomUUID();
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
