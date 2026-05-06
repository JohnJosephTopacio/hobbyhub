import pool from '../db.js'

export function findUserByEmail(email) {
  // for efficiency, returns 1 instead of the whole row of data 
  return pool.query('SELECT 1 FROM users WHERE email=$1', [email]);
}

export function findUserByUsername(username) {
  return pool.query('SELECT 1 FROM users WHERE username=$1', [username]);
}

export function insertUser(email, username, hashedPassword) {
  return pool.query('INSERT INTO users (email, username, password) VALUES ($1, $2, $3)', [email, username, hashedPassword]);
}
