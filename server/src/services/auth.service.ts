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
  updateInactiveToken,
} from '../repositories/auth.repository.js';

interface TokenSet {
  accessToken: string;
  refreshToken: string;
}

export async function registerUserService(input: RegisterBody): Promise<void> {
  // Check if email is already registered
  const { email, username, password } = input;
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

export async function loginUserService(input: LoginBody): Promise<TokenSet> {
  const { email, password } = input;
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

  // If all is well, the user is logged on - send back JWT Token
  const refreshToken = createRefreshToken(user.id, jti);

  // Time at the moment + 15 days
  const refreshTokenExpiry = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000);
  await storeRefreshToken(jti, user.id, refreshTokenExpiry);

  const accessToken = createAccessToken(user.id);
  return { accessToken, refreshToken };
}

export async function refreshTokenService(refreshToken: RefreshTokenBody): Promise<TokenSet> {
  let decoded: RefreshPayload;
  try {
    const verified = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET);
    if (isRefreshPayload(verified)) {
      decoded = verified;
    } else {
      throw Error('Invalid Refresh Token Payload Shape');
    }
  } catch (error) {
    throw error;
  }

  // CHECK IF REFRESH TOKEN MATCHES ANY REFRESH TOKEN IN THE DATABASE
  const tokenRecord = await getRefreshTokenByJti(decoded.jti);

  if (tokenRecord.rows.length < 1) {
    throw new Error('Refresh token does not match any token in the database.');
  }

  // CHECK IF TOKEN MATCHED IS NOT REVOKED
  if (tokenRecord.rows[0]!.token_status === 'REVOKED') {
    // TODO: log all user sessions, a malicious actor may be trying to get in

    throw new Error('Refresh token has been revoked.');
  }

  // CHECK EXPIRY
  if (tokenRecord.rows[0]!.expires_at < new Date()) {
    throw new Error('Refresh Token has expired.');
  }

  const client = await pool.connect();
  let newRefreshToken: string = '';

  try {
    // BEGIN TRANSACTION - note: Lock the row to handle race condition
    await client.query('BEGIN');
    // MAKE OLD REFRESH TOKEN INACTIVE
    updateInactiveToken(decoded.jti, client);
    // SIGN AND STORE NEW REFRESH TOKEN IN DATABASE
    const jti = crypto.randomUUID();
    newRefreshToken = jwt.sign(
      {
        sub: decoded.sub,
        jti: jti,
      },
      env.JWT_REFRESH_SECRET,
      { expiresIn: '15d' },
    );

    const expires_at = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000);

    storeRefreshToken(jti, Number(decoded.sub), expires_at);
    // COMMIT
    await client.query('COMMIT');
  } catch (error) {
    // ROLLBACK
    await client.query('ROLLBACK');
    throw error;
  }

  // RETURN NEW ACCESS TOKEN IN MEMORY AND NEW REFRESH TOKEN IN COOKIE
  const accessToken = jwt.sign({ sub: decoded.sub }, env.JWT_ACCESS_SECRET, {
    expiresIn: '5m',
  });

  if (newRefreshToken === '') {
    throw new Error('New refresh token missing');
  }

  return { accessToken, refreshToken: newRefreshToken };
}
