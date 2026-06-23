  import pool from '../db.js'

  interface UserAuthRow {
    id: number,
    password: string
  }

  interface UserInfo {
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

  export function insertUser(email: string, username: string, hashedPassword: string) {
    return pool.query('INSERT INTO users (email, username, password) VALUES ($1, $2, $3)', [email, username, hashedPassword]);
  } 

  export function getUserByEmail(email: string) {
    return pool.query<UserAuthRow>('SELECT id, password FROM users WHERE email=$1', [email]);
  }

  export function getUserInfo(userId: number) {
    return pool.query<UserInfo>('SELECT username, email, created_at FROM users WHERE id=$1', [userId]);
  }