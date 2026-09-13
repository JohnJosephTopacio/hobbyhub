import { Pool } from 'pg';
import { readdir, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import path from 'node:path';

const pool = new Pool({
  connectionString: 'postgresql://hobbyhub_backend:hub_secret_5_28@localhost:5432/hobbyhub_test',
});

console.log('test database migrate start');

const migrationPath = resolve(import.meta.dirname, '../migrations');

async function getMigrationFileNames() {
  const files = await readdir(migrationPath);
  return files;
}

const files = await getMigrationFileNames();

if (files.length === 0) {
  throw Error('Empty directory');
}

// get the paths of files in the migrations folder except for seed.sql
const migrationFiles = files // it's important the script runs in order
  ?.filter((file) => file !== 'seed.sql')
  // filter first before sort for efficiency
  .sort()
  .map((file) => resolve(migrationPath, file));

for (const file of migrationFiles) {
  const query = await readFile(file, 'utf-8');
  try {
    await pool.query(query);
    console.log(`Successfuly ran script: ${path.basename(file)}`);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Note: only use for dev scripts
pool.end();
