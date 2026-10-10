import { createSessionWithInitialToken } from '../repositories/authSessions.repository.js';
import type { ClientMetadata } from '../types/auth.js';
import { createAccessToken, createRefreshToken } from './token.service.js';

export async function startAuthSession(clientMetadata: ClientMetadata, userId: number) {
  const sessionId = crypto.randomUUID();
  // The session expires 30 days after creation
  const sessionExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  const refreshTokenId = crypto.randomUUID();
  const refreshTokenExpiry = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000);
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
