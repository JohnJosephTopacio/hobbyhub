import { Pool } from 'pg';
import { env } from '../config/env.js';

const pool = new Pool({
  host: env.DB_HOST,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB,
  port: env.DB_PORT,
});

const testConnection = async () => {
  try {
    await pool.query('SELECT NOW()');
    console.log('Database reachable.');
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Database connection failed', error.message);
    } else {
      console.error('Database connection failed', error);
    }
    // stop the program from running, otherwise it'd be idle and still consuming resource
    await pool.end();
    process.exit(1);
  }
};

testConnection();

export default pool;
