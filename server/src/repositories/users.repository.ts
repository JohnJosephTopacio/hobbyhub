import pool from '../db/db.js';

export interface UserInfo {
  username: string;
  email: string;
  createdAt: Date;
}

export interface UserProfile {
  username: string;
  userId: number;
  avatarUrl: string;
  coverUrl: string;
  bio: string;
  private: boolean;
}

export function getUserInfo(userId: number) {
  return pool.query<UserInfo>('SELECT username, email, created_at FROM users WHERE id = $1', [
    userId,
  ]);
}

export function getUserProfile(username: string) {
  return pool.query<UserProfile>(
    'SELECT username, profiles.user_id, avatar_url, cover_url, bio, private FROM users JOIN profiles ON users.id = profiles.user_id JOIN user_tags ON users.id = user_tags.id WHERE username = $1',
    [username],
  );
}

export function getLimitedProfile(username: string) {
  return pool.query<UserProfile>(
    'SELECT username, user_id, avatar_url, cover_url, bio, private FROM users JOIN profiles ON users.id = profiles.user_id WHERE username = $1',
    [username],
  );
}
