import pool from '../db/db.js';

export function getActiveCategories() {
  return pool.query('SELECT * FROM hobby_categories');
}
