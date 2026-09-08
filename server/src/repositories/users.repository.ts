import pool from '../db/db.js';
import { PatchProfileBody } from '../schemas/user.schema.js';

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

type SqlValue = string | number | boolean | null;

export function getUserInfo(userId: number) {
  return pool.query<UserInfo>('SELECT username, email, created_at FROM users WHERE id = $1', [
    userId,
  ]);
}

export function getUserProfile(username: string) {
  return pool.query<UserProfile>(
    'SELECT username, profiles.user_id, avatar_url, cover_url, bio, private, user_tags.tag_id FROM users JOIN profiles ON users.id = profiles.user_id JOIN user_tags ON users.id = user_tags.user_id WHERE username = $1',
    [username],
  );
}

export function getLimitedProfile(username: string) {
  return pool.query<UserProfile>(
    'SELECT username, user_id, avatar_url, cover_url, bio, private FROM users JOIN profiles ON users.id = profiles.user_id WHERE username = $1',
    [username],
  );
}

export function updateProfile(userId: number, input: PatchProfileBody) {
  const fields: string[] = [];
  const values: SqlValue[] = [];

  if (input.bio !== undefined) {
    values.push(input.bio);
    fields.push(`bio = $${values.length}`);
  }

  if (input.private !== undefined) {
    values.push(input.private);
    fields.push(`private = $${values.length}`);
  }

  if (input.avatarUrl !== undefined) {
    values.push(input.avatarUrl);
    fields.push(`avatar_url = $${values.length}`);
  }

  if (input.coverUrl !== undefined) {
    values.push(input.coverUrl);
    fields.push(`cover_url = $${values.length}`);
  }

  values.push(userId);

  return pool.query(
    `
    UPDATE profiles
    SET ${fields.join(', ')}
    WHERE user_id = $${values.length}
    RETURNING user_id, bio, private, avatar_url, cover_url  
    `,
    values,
  );
}

export function getProfileTags(userId: number) {
  return pool.query(
    'SELECT user_id, tag, category, slug FROM user_tags JOIN hobby_tags ON tag_id = hobby_tags.id JOIN hobby_categories ON hobby_tags.category_id = hobby_categories.id WHERE user_id = $1 AND hobby_tags.is_active = true AND hobby_categories.is_active = true',
    [userId],
  );
}
