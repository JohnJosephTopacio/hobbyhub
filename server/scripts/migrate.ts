import 'dotenv/config'
import { readdir, readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import pool from '../src/db/db.js';
import path from 'node:path';

console.log('migrate start')

const migrationPath = resolve(import.meta.dirname,'migrations');

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
?.filter(file => file !== 'seed.sql')
// filter first before sort for efficiency
.sort()
.map(file => resolve(migrationPath, file));

for (const file of migrationFiles) {
  const query = await readFile(file, 'utf-8');
  try {
    await pool.query(query);
    console.log(`Successfuly ran script: ${path.basename(file)}`);
  } catch(error) {
    console.error(error);
    throw(error);
  }
}

// Note: only use for dev scripts
pool.end()


