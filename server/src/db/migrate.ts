import 'dotenv/config'
import { readdir, readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import pool from './db.js';

const migrationPath = resolve(import.meta.dirname,'migrations');

async function getMigrationFileNames() {  
  try {
    const files = await readdir(migrationPath);
    return files;
  } catch (error) {
    console.error(error);
    return null;
  }
}

const files = await getMigrationFileNames();
// get the paths of files in the migrations folder except for seed.sql
const migrationFiles = files
?.filter(file => file !== 'seed.sql')
.map(file => resolve(migrationPath, file));

if (!migrationFiles) {
  throw Error('missing migration files');
}

for (const file of migrationFiles) {
  const query = await readFile(file, 'utf-8');
  try {
    await pool.query(query);
  } catch(error) {
    console.error(error);
  }
}


