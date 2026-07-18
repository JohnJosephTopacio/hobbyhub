import { PoolClient } from 'pg';
import pool from '../db/db.js';

interface UserAuthRow {
  id: number;
  password: string;
}

export interface UserInfo {
  username: string;
  email: string;
  created_at: Date;
}

export interface RefreshToken {
  jti: string;
  user_id: number;
  expires_at: Date;
  token_status: string;
}

export function checkUserExistsByEmail(email: string) {
  // For efficiency, returns 1 instead of the whole row of data
  return pool.query('SELECT 1 FROM users WHERE email=$1', [email]);
}

export function checkUserExistsByUsername(username: string) {
  return pool.query('SELECT 1 FROM users WHERE username=$1', [username]);
}

export async function insertUserAndCreateProfile(
  email: string,
  username: string,
  hashedPassword: string,
) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const userRecord = await client.query(
      `
      INSERT INTO users(email, username, password) 
      VALUES ($1, $2, $3) RETURNING id;
    `,
      [email, username, hashedPassword],
    );
    await client.query(
      `
      INSERT INTO profiles(user_id) 
      VALUES ($1);
    `,
      [userRecord.rows[0].id],
    );
    await client.query('COMMIT');
    return userRecord;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    if (client) {
      client.release();
    }
  }
}

export function getUserByEmail(email: string) {
  return pool.query<UserAuthRow>('SELECT id, password FROM users WHERE email=$1', [email]);
}

export function getUserInfo(userId: number) {
  return pool.query<UserInfo>('SELECT username, email, created_at FROM users WHERE id=$1', [
    userId,
  ]);
}

// Postgres driver auto-converts Date object to UTC which fits TIMESTAMPTZ
export function storeRefreshToken(jti: string, userId: number, expires_at: Date) {
  return pool.query('INSERT INTO auth_sessions (jti, user_id, expires_at) VALUES ($1, $2, $3)', [
    jti,
    userId,
    expires_at,
  ]);
}

export function getRefreshTokenByJti(jti: string) {
  return pool.query<RefreshToken>(
    'SELECT jti, user_id, expires_at, token_status FROM auth_sessions WHERE jti = $1',
    [jti],
  );
}

export function updateInactiveToken(jti: string, client: PoolClient) {
  return client.query('UPDATE auth_sessions SET token_status = $1 WHERE jti = $2', [
    'ROTATED',
    jti,
  ]);
}
