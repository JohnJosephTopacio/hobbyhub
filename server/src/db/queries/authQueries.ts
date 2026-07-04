  import pool from '../db.js'

  interface UserAuthRow {
    id: number,
    password: string
  }

  export interface UserInfo {
    username: string,
    email: string,
    created_at: Date
  }

  export function checkUserExistsByEmail(email: string) {
    // For efficiency, returns 1 instead of the whole row of data 
    return pool.query('SELECT 1 FROM users WHERE email=$1', [email]);
  }

  export function checkUserExistsByUsername(username: string) {
    return pool.query('SELECT 1 FROM users WHERE username=$1', [username]); 
  }

  export async function insertUserAndCreateProfile(email: string, username: string, hashedPassword: string) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN')
      const userRecord = await client.query(
      `
        INSERT INTO users(email, username, password) 
        VALUES ($1, $2, $3) RETURNING id;
      `
      ,[email, username, hashedPassword]);
      await client.query(
      `
        INSERT INTO profiles(user_id) 
        VALUES ($1);
      `
      ,[userRecord.rows[0].id]);
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
    return pool.query<UserInfo>('SELECT username, email, created_at FROM users WHERE id=$1', [userId]);
  }