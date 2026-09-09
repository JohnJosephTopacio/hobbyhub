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
    `
    SELECT 
      u.username, 
      p.user_id, 
      p.avatar_url, 
      p.cover_url, 
      p.bio, 
      p.private
    FROM users AS u
    JOIN profiles AS p ON p.user_id = u.id 
    WHERE username = $1
    `,
    [username],
  );
}

export function getLimitedProfile(username: string) {
  return pool.query<UserProfile>(
    `
    SELECT 
        u.username, 
        p.user_id, 
        p.avatar_url, 
        p.cover_url, 
        p.bio, 
        p.private 
      FROM users AS u 
      JOIN profiles AS p ON p.user_id = u.id
      WHERE username = $1`,
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

export function getProfileTags(username: string) {
  return pool.query(
    `
    SELECT 
      ut.user_id,
      ht.tag,
      hc.category, 
      hc.slug 
    FROM user_tags AS ut 
    JOIN users AS u ON u.id = ut.user_id
    JOIN hobby_tags AS ht ON ht.id = ut.tag_id
    JOIN hobby_categories AS hc ON hc.id = ht.category_id 
    WHERE username = $1  
      AND ht.is_active = true 
      AND hc.is_active = true
    ORDER BY hc.category, ht.tag
    `,
    [username],
  );
}
