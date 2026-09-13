import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { RegisterBody, LoginBody, RefreshTokenBody } from '../schemas/auth.schema.js';
import { createAccessToken, createRefreshToken } from './token.service.js';
import { RefreshPayload, isRefreshPayload } from '../types/auth.js';
import pool from '../db/db.js';
import {
  EmailRegistered,
  UsernameRegistered,
  EmailNotRegistered,
  IncorrectPassword,
} from '../errors/index.js';
import {
  userExistsByEmail,
  userExistsByUsername,
  createUserWithProfile,
  getUser,
  storeRefreshToken,
  getRefreshTokenByJti,
  rotateToken,
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
  // Check if email is already registered
  const emailExists = await userExistsByEmail(email);
  if (emailExists) {
    throw new EmailRegistered();
  }

  // Check if username already exists
  const usernameExists = await userExistsByUsername(username);
  if (usernameExists) {
    throw new UsernameRegistered();
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, env.BCRYPT_COST_FACTOR ?? 10);

  // Create the user in the users table
  await createUserWithProfile(email, username, hashedPassword);
}

export async function loginUserService({ email, password }: LoginBody): Promise<TokenSet> {
  const userAuthRecord = await getUser(email);

  // Check if the email is not registered
  if (!userAuthRecord.rows[0]) {
    throw new EmailNotRegistered();
  }

  const user = userAuthRecord.rows[0];
  const hashedPassword = user.password;

  // Hash the incoming password and compare it to the hashed password in the database, if it does not match send an error
  const isPasswordCorrect = await bcrypt.compare(password, hashedPassword);

  if (!isPasswordCorrect) {
    throw new IncorrectPassword();
  }

  // JTI means JWT ID
  const jti = crypto.randomUUID();
  const sub = user.id.toString();

  // If all is well, the user is logged on - send back JWT Token
  const refreshToken = createRefreshToken(sub, jti);

  // Time at the moment + 15 days
  const refreshTokenExpiry = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000);
  await storeRefreshToken(jti, user.id, refreshTokenExpiry);

  const accessToken = createAccessToken(sub);
  return { accessToken, refreshToken };
}

export async function refreshTokenService(refreshToken: RefreshTokenBody): Promise<TokenSet> {
  let decoded: RefreshPayload;
  const verified = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET);
  if (isRefreshPayload(verified)) {
    decoded = verified;
  } else {
    throw Error('Invalid Refresh Token Payload Shape');
  }

  const client = await pool.connect();
  let newRefreshToken: string;

  // Refresh Token Rotation Transaction
  try {
    await client.query('BEGIN');

    // Retrieve matching refresh token
    const tokenRecord = await getRefreshTokenByJti(decoded.jti, client);

    // Check if refresh token is in the database
    if (tokenRecord.rows.length < 1) {
      throw new Error('Refresh token does not match any token in the database.');
    }

    // Check if refresh token is revoked
    if (tokenRecord.rows[0]!.tokenStatus === 'REVOKED') {
      // TODO: log all user sessions, a malicious actor may be trying to get in

      throw new Error('Refresh token has been revoked.');
    }

    // Check if refresh token is expired
    if (tokenRecord.rows[0]!.expiresAt < new Date()) {
      throw new Error('Refresh Token has expired.');
    }

    // TODO: Add check for rotated tokens

    // Update the refresh token's status to rotated
    await rotateToken(decoded.jti, client);

    // Create new refresh token
    const jti = crypto.randomUUID();
    newRefreshToken = createRefreshToken(decoded.sub, jti);
    const expiresAt = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000);

    // Store the new refresh token in database
    await storeRefreshToken(jti, Number(decoded.sub), expiresAt, client);

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }

  // Create new access token
  const newAccessToken = createAccessToken(decoded.sub);

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
}
