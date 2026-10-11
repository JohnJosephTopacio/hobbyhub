import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { RegisterBody, LoginBody, RefreshTokenBody } from '../schemas/auth.schema.js';
import { createAccessToken, createRefreshToken } from './token.service.js';
import { ClientMetadata, isRefreshPayload } from '../types/auth.js';
import pool from '../db/db.js';
import {
  EmailRegistered,
  EmailNotRegistered,
  IncorrectPassword,
  InvalidPayloadShape,
  UsernameRegisteredAlready,
  RefreshTokenNotFound,
  RefreshTokenRevoked,
  RefreshTokenRotated,
  RefreshTokenExpired,
  SessionInvalid,
  SessionExpired,
} from '../errors/index.js';
import {
  userExistsByEmail,
  userExistsByUsername,
  createUserWithProfile,
  getRefreshTokenByJti,
  rotateToken,
  getUserByEmail,
  insertNewRefreshToken,
  getSessionInfo,
  getSessionIdFromJti,
  updateSessionLastActivityAndIp,
} from '../repositories/auth.repository.js';
import { startAuthSession } from './authSession.service.js';
import { authConfig } from '../config/auth.js';

interface TokenSet {
  accessToken: string;
  refreshToken: string;
}

export async function registerUserService({
  email,
  username,
  password,
}: RegisterBody): Promise<void> {
  const emailExists = await userExistsByEmail(email);
  if (emailExists) {
    throw new EmailRegistered();
  }

  const usernameExists = await userExistsByUsername(username);
  if (usernameExists) {
    throw new UsernameRegisteredAlready();
  }

  const hashedPassword = await bcrypt.hash(password, env.BCRYPT_COST_FACTOR ?? 10);

  await createUserWithProfile(email, username, hashedPassword);
}

export async function loginUserService(
  { email, password }: LoginBody,
  clientMetadata: ClientMetadata,
): Promise<TokenSet> {
  const user = (await getUserByEmail(email)).rows[0];

  if (!user) {
    throw new EmailNotRegistered();
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    throw new IncorrectPassword();
  }

  return startAuthSession(clientMetadata, user.id);
}

export async function refreshTokenService(
  refreshToken: RefreshTokenBody,
  ipAddress: string | undefined,
) {
  const payload = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET);

  if (!isRefreshPayload(payload)) {
    throw new InvalidPayloadShape();
  }

  const client = await pool.connect();
  let newRefreshToken: string;
  let newAccessToken: string;
  let expiryInMs: number;
  const oldRefreshTokenJti = payload.jti;

  try {
    await client.query('BEGIN');

    const sessionId = await getSessionIdFromJti(oldRefreshTokenJti, client);
    if (sessionId === null) {
      throw new RefreshTokenNotFound();
    }

    const sessionInfo = await getSessionInfo(sessionId, client);

    const matchingRefreshToken = await getRefreshTokenByJti(oldRefreshTokenJti, client);
    if (matchingRefreshToken === null) {
      throw new RefreshTokenNotFound();
    }

    const tokenStatus = matchingRefreshToken.tokenStatus;

    if (tokenStatus === 'REVOKED') {
      throw new RefreshTokenRevoked();
    }

    if (tokenStatus === 'ROTATED') {
      throw new RefreshTokenRotated();
    }

    if (matchingRefreshToken.expiresAt < new Date()) {
      throw new RefreshTokenExpired();
    }

    const dateNow = new Date(Date.now());
    const sessionExpiry = sessionInfo.expiresAt;

    const isSessionExpired = dateNow >= sessionExpiry;

    if (isSessionExpired) {
      throw new SessionExpired();
    }

    const isSessionActive = sessionInfo.sessionStatus === 'ACTIVE';

    if (!isSessionActive) {
      throw new SessionInvalid();
    }

    const newRefreshTokenJti = crypto.randomUUID();

    const refreshTokenExpiry = new Date(Date.now() + authConfig.refreshTokenTtlSeconds * 1000);
    const expiresAt = refreshTokenExpiry > sessionExpiry ? sessionExpiry : refreshTokenExpiry;

    expiryInMs = expiresAt.getTime() - Date.now();
    const sub = sessionInfo.userId.toString();

    await rotateToken(oldRefreshTokenJti, newRefreshTokenJti, dateNow, client);
    newRefreshToken = createRefreshToken(sub, newRefreshTokenJti, expiryInMs);

    await insertNewRefreshToken(
      newRefreshTokenJti,
      matchingRefreshToken.sessionId,
      expiresAt,
      client,
    );

    await updateSessionLastActivityAndIp(sessionId, ipAddress, dateNow, client);

    newAccessToken = createAccessToken(sub);

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }

  return { accessToken: newAccessToken, refreshToken: newRefreshToken, expiryInMs };
}
