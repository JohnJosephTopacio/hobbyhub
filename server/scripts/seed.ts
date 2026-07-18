import 'dotenv/config';
import { resolve } from 'node:path';
import { readFile } from 'node:fs/promises';
import pool from '../src/db/db.js';
import path from 'node:path';

const seedPath = resolve(import.meta.dirname, '../seeds/seed.sql');

async function getSeedingFile(seedPath: string) {
  const query = await readFile(seedPath, { encoding: 'utf-8' });
  return query;
}

const query = await getSeedingFile(seedPath);

if (query === '') {
  throw Error('Error Seeding: No Query Found');
}

try {
  await pool.query(query);
} catch (error) {
  throw error;
}
console.log(`Seeding file: ${path.basename(seedPath)} Successful!`);

pool.end();
