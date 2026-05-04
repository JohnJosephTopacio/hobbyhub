import { Pool } from 'pg'

const pool = new Pool({
  host: process.env.DB_HOST,
  user:  process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB,
  port: process.env.DB_PORT,
});

const testConnection = async () => {
  try {
    await pool.query('SELECT NOW()');
    console.log('Database reachable.')
  } catch (error) {
    console.err('Database connection failed', error.message);
    process.exit(1);
  }
};

testConnection();

export default pool;





