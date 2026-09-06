import pool from '../db/db.js';

export function getActiveCategories() {
  return pool.query('SELECT * FROM hobby_categories');
}

export function findCategoryTags(categorySlug: string) {
  return pool.query(
    'SELECT * FROM hobby_tags WHERE category_id = (SELECT id FROM hobby_categories WHERE slug = $1)',
    [categorySlug],
  );
}

export async function tagExists(tagName: string, categoryId: number) {
  const result = await pool.query(
    'SELECT tag FROM hobby_tags WHERE tag = $1 AND category_id = $2',
    [tagName, categoryId],
  );
  return result.rows.length > 0;
}

export function insertTag(tagName: string, categoryId: number) {
  return pool.query(
    'INSERT INTO hobby_tags (tag, category_id) VALUES ($1, $2) RETURNING tag, category_id',
    [tagName, categoryId],
  );
}
