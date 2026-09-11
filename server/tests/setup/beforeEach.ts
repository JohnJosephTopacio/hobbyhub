import pool from '../../src/db/db.js';
import { beforeEach, afterAll } from 'vitest';

beforeEach(async () => {
  await pool.query(
    `TRUNCATE TABLE user_tags, profiles, users, hobby_tags, hobby_categories RESTART IDENTITY CASCADE`,
  );
});

afterAll(async () => {
  await pool.end();
});
