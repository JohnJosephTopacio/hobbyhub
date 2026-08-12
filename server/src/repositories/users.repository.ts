import pool from '../db/db.js';

export interface UserInfo {
  username: string;
  email: string;
  createdAt: Date;
}

export function getUserInfo(userId: number) {
  return pool.query<UserInfo>('SELECT username, email, created_at FROM users WHERE id = $1', [
    userId,
  ]);
}
