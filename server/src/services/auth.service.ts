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
} from '../errors/index.js';
import {
  userExistsByEmail,
  userExistsByUsername,
  createUserWithProfile,
  storeRefreshToken,
  getRefreshTokenByJti,
  rotateToken,
  getUserByEmail,
} from '../repositories/auth.repository.js';

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

  const jti = crypto.randomUUID();
  const sub = user.id.toString();

  const refreshToken = createRefreshToken(sub, jti);

  // Time at the moment + 15 days
  const refreshTokenExpiry = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000);
  await storeRefreshToken(jti, user.id, refreshTokenExpiry);

  const accessToken = createAccessToken(sub);
  return { accessToken, refreshToken };
}

export async function refreshTokenService(refreshToken: RefreshTokenBody): Promise<TokenSet> {
  const payload = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET);

  if (!isRefreshPayload(payload)) {
    throw new InvalidPayloadShape();
  }

  const client = await pool.connect();
  let newRefreshToken: string;

  // Refresh Token Rotation Transaction
  try {
    await client.query('BEGIN');

    // Retrieve matching refresh token
    const tokenRecord = await getRefreshTokenByJti(payload.jti, client);

    // Check if refresh token is in the database
    if (tokenRecord.rows.length < 1) {
      throw new Error('Refresh token does not match any token in the database.');
    }

    const tokenStatus = tokenRecord.rows[0]!.tokenStatus;

    // Check if refresh token is revoked
    if (tokenStatus === 'REVOKED') {
      // TODO: log all user sessions, a malicious actor may be trying to get in

      throw new Error('Refresh token has been revoked.');
    }

    // TODO: Add check for rotated tokens
    if (tokenStatus === 'ROTATED') {
      throw new Error('Refresh Token has been rotated.');
    }

    // Check if refresh token is expired
    if (tokenRecord.rows[0]!.expiresAt < new Date()) {
      throw new Error('Refresh Token has expired.');
    }

    // Update the refresh token's status to rotated
    await rotateToken(payload.jti, client);

    // Create new refresh token
    const jti = crypto.randomUUID();
    newRefreshToken = createRefreshToken(payload.sub, jti);
    const expiresAt = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000);

    // Store the new refresh token in database
    await storeRefreshToken(jti, Number(payload.sub), expiresAt, client);

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }

  // Create new access token
  const newAccessToken = createAccessToken(payload.sub);

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
}
