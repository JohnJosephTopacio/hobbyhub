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
