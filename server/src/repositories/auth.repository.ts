import { PoolClient } from 'pg';
import pool from '../db/db.js';

interface UserAuthRow {
  id: number;
  password: string;
}

export interface RefreshTokenRow {
  jti: string;
  session_id: string;
  created_at: Date;
  expires_at: Date;
  token_status: string;
  replaced_by: string;
  rotated_at: Date;
  revoked_at: Date;
}

export interface RefreshToken {
  jti: string;
  sessionId: string;
  createdAt: Date;
  expiresAt: Date;
  tokenStatus: string;
  replacedBy: string;
  rotatedAt: Date;
  revokedAt: Date;
}

export interface SessionInfoRecord {
  session_status: string;
  expires_at: Date;
  user_id: number;
}

export interface SessionInfo {
  sessionStatus: string;
  expiresAt: Date;
  userId: number;
}

export interface SessionIdRecord {
  session_id: string;
}

export async function userExistsByEmail(email: string): Promise<boolean> {
  // For efficiency, returns 1 instead of the whole row of data
  const result = await pool.query('SELECT 1 FROM users WHERE email = $1 LIMIT 1', [email]);
  return result.rows.length > 0;
}

export async function userExistsByUsername(username: string): Promise<boolean> {
  const result = await pool.query('SELECT 1 FROM users WHERE username = $1 LIMIT 1', [username]);
  return result.rows.length > 0;
}

export async function createUserWithProfile(
  email: string,
  username: string,
  hashedPassword: string,
): Promise<number> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await client.query<{ id: number }>(
      `
      INSERT INTO users(email, username, password) 
      VALUES ($1, $2, $3) RETURNING id;
    `,
      [email, username, hashedPassword],
    );

    const userRecord = result.rows[0];
    if (!userRecord) {
      throw new Error('User creation failed. No rows were returned.');
    }
    const userId = userRecord.id;

    await client.query(
      `
      INSERT INTO profiles(user_id) 
      VALUES ($1);
    `,
      [userId],
    );
    await client.query('COMMIT');
    return userId;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

export function getUserByEmail(email: string) {
  return pool.query<UserAuthRow>('SELECT id, password FROM users WHERE email = $1', [email]);
}

export async function getSessionIdFromJti(jti: string, client: PoolClient) {
  const sessionIdRecord = (
    await client.query<SessionIdRecord>('SELECT session_id from refresh_tokens WHERE jti = $1', [
      jti,
    ])
  ).rows[0];

  if (sessionIdRecord === undefined) {
    return null;
  }

  return sessionIdRecord.session_id;
}

export async function getRefreshTokenByJti(
  jti: string,
  client: PoolClient,
): Promise<RefreshToken | null> {
  const refreshTokenRecord = (
    await client.query<RefreshTokenRow>('SELECT * FROM refresh_tokens WHERE jti = $1 FOR UPDATE', [
      jti,
    ])
  ).rows[0];

  if (refreshTokenRecord === undefined) {
    return null;
  }

  return {
    jti: refreshTokenRecord.jti,
    sessionId: refreshTokenRecord.session_id,
    createdAt: refreshTokenRecord.created_at,
    expiresAt: refreshTokenRecord.expires_at,
    tokenStatus: refreshTokenRecord.token_status,
    replacedBy: refreshTokenRecord.replaced_by,
    rotatedAt: refreshTokenRecord.rotated_at,
    revokedAt: refreshTokenRecord.revoked_at,
  };
}

export async function getSessionInfo(sessionId: string, client: PoolClient): Promise<SessionInfo> {
  const sessionInfo = (
    await client.query<SessionInfoRecord>(
      'SELECT session_status, expires_at, user_id FROM auth_sessions WHERE session_id = $1 FOR UPDATE',
      [sessionId],
    )
  ).rows[0];

  if (sessionInfo === undefined) {
    throw new Error('Session could not be found');
  }

  return {
    sessionStatus: sessionInfo.session_status,
    expiresAt: sessionInfo.expires_at,
    userId: sessionInfo.user_id,
  };
}

export function rotateToken(oldJti: string, newJti: string, rotatedAt: Date, client: PoolClient) {
  return client.query(
    'UPDATE refresh_tokens SET token_status = $1, rotated_at = $2, replaced_by = $3 WHERE jti = $4',
    ['ROTATED', rotatedAt, newJti, oldJti],
  );
}

export function insertNewRefreshToken(
  jti: string,
  sessionId: string,
  expiresAt: Date,
  client: PoolClient,
) {
  return client.query(
    'INSERT INTO refresh_tokens (jti, session_id, expires_at) VALUES ($1, $2, $3)',
    [jti, sessionId, expiresAt],
  );
}

export function updateSessionLastActivityAndIp(
  sessionId: string,
  ipAddress: string | undefined,
  dateNow: Date,
  client: PoolClient,
) {
  return client.query(
    'UPDATE auth_sessions SET last_activity_at = $1, last_ip = $2 WHERE session_id = $3',
    [dateNow, ipAddress, sessionId],
  );
}
