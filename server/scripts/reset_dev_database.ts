import 'dotenv/config';
import pool from '../src/db/db.js';

console.log('Reset Start');

try {
  await pool.query('DROP SCHEMA public CASCADE;');
  await pool.query('CREATE SCHEMA public;');

  console.log(`Successfully dropped tables `);
} catch (error) {
  console.error(error);
}

// Note: only use for dev scripts
pool.end();
