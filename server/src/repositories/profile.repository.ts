import pool from '../db/db.js';

export function insertProfileTag(userId: number, tagId: number) {
  return pool.query('INSERT INTO user_tags (user_id, tag_id) VALUES ($1, $2)', [userId, tagId]);
}
