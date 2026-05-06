  import pool from '../db.js'

  export function checkUserExistsByEmail(email) {
    // for efficiency, returns 1 instead of the whole row of data 
    return pool.query('SELECT 1 FROM users WHERE email=$1', [email]);
  }

  export function checkUserExistsByUsername(username) {
    return pool.query('SELECT 1 FROM users WHERE username=$1', [username]);
  }

  export function insertUser(email, username, hashedPassword) {
    return pool.query('INSERT INTO users (email, username, password) VALUES ($1, $2, $3)', [email, username, hashedPassword]);
  }

  export function getUserByEmail(email) {
    return pool.query('SELECT id, password FROM users WHERE email=$1', [email]);
  }