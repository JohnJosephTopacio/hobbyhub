import { createSessionWithInitialToken } from '../repositories/authSession.repository.js';
import type { ClientMetadata } from '../types/auth.js';
import { createAccessToken, createRefreshToken } from './token.service.js';
import { authConfig } from '../config/auth.js';

export async function startAuthSession(clientMetadata: ClientMetadata, userId: number) {
  const dateNow = Date.now();
  const sessionId = crypto.randomUUID();
  const sessionExpiry = new Date(dateNow + authConfig.sessionTtlSeconds * 1000);

  const refreshTokenId = crypto.randomUUID();
  const refreshTokenExpiry = new Date(dateNow + authConfig.refreshTokenTtlSeconds * 1000);
  const sub = userId.toString();

  const refreshToken = createRefreshToken(sub, refreshTokenId);
  const accessToken = createAccessToken(sub);
  await createSessionWithInitialToken(
    sessionId,
    sessionExpiry,
    clientMetadata,
    refreshTokenId,
    refreshTokenExpiry,
    userId,
  );

  return { refreshToken, accessToken };
}
