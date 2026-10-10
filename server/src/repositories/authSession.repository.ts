import pool from '../db/db.js';
import type { ClientMetadata } from '../types/auth.js';

export async function createSessionWithInitialToken(
  sessionId: string,
  sessionExpiry: Date,
  clientMetadata: ClientMetadata,
  refreshTokenId: string,
  refreshTokenExpiry: Date,
  userId: number,
) {
  const { clientName, operatingSystem, deviceType, userAgent, initialIp } = clientMetadata;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(
      'INSERT INTO auth_sessions(session_id, user_id, expires_at, client_name, operating_system, device_type, user_agent, initial_ip, last_ip) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
      [
        sessionId,
        userId,
        sessionExpiry,
        clientName,
        operatingSystem,
        deviceType,
        userAgent,
        initialIp,
        initialIp,
      ],
    );
    await client.query(
      'INSERT INTO refresh_tokens(jti, session_id, expires_at) VALUES ($1, $2, $3)',
      [refreshTokenId, sessionId, refreshTokenExpiry],
    );
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}
