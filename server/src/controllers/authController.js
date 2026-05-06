
import bcrypt from 'bcryptjs';

import { findUserByEmail, findUserByUsername, insertUser } from '../db/queries/authQueries.js';

export async function registerUser(req, res, next) {
  try {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const { email, username, password,confirmationPassword } = req.body;
  
    // check if required fields exist on the response body 
    if ( !email || !username || !password || !confirmationPassword ) {
      return res.status(400).json({message: 'All fields are required.'})
    }

    // check if email format is proper
    if (!regex.test(email)) {
      return res.status(400).json({message: 'Wrong Email Format.'})
    }
    
    // check if password matches confirmation password
    if (!(password === confirmationPassword)) {
      return res.status(400).json({message: 'Passwords do not match.'});
    }
  
    // check if email is already registered
    const existingEmails = await findUserByEmail(email);
    if (existingEmails.rowCount !== 0) {
      return res.status(400).json({message: 'Email is already registered.'});
    }
    
    // check if username already exists
    const existingUsernames = await findUserByUsername(username);
    if (existingUsernames.rowCount !== 0) {
      return res.status(400).json({message: 'Username already exists.'});
    }
  
    // hash the password 
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
  
    // create the user in the users table
    await insertUser(email, username, hashedPassword);
    res.status(201).json({message: 'User has been created'});
  } catch (err) {
    next(err);
  }
}

