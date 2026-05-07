
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { checkUserExistsByEmail, checkUserExistsByUsername, insertUser, getUserByEmail, getUserInfo } from '../db/queries/authQueries.js';

export async function registerUser(req, res, next) {
  try {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const { email, username, password,confirmationPassword } = req.body;
  
    // check if required register fields exist on the response body 
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
    const existingEmails = await checkUserExistsByEmail(email);
    if (existingEmails.rowCount !== 0) {
      return res.status(409).json({message: 'Email is already registered.'});
    }
    
    // check if username already exists
    const existingUsernames = await checkUserExistsByUsername(username);
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

export async function loginUser(req, res, next) {
  try {
    const { email, password } = req.body;
  
    // check if required login fields exists
    if (!email || !password) {
      return res.status(400).json({ message: 'All fields are required.'})
    }

    // check if the email is registered
    const existingEmail = await getUserByEmail(email);
    if (existingEmail.rowCount === 0) {
      return res.status(401).json({ message: 'Invalid Email or Password.'});
    } 

    const hashedPassword = existingEmail.rows[0].password;

    // hash the incoming password and compare it to the hashed password in the database, if it does not match send an error
    const isPasswordCorrect = await bcrypt.compare(password, hashedPassword);
    
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Invalid Email or Password.'});
    }
    
    // if all is well, the user is logged on - send back JWT Token

    const token = jwt.sign({
      userId: existingEmail.rows[0].id,
      }, 
      process.env.JWT_SECRET,
      { expiresIn: "1h" });

    return res.status(200).json({ 
        message: 'User has logged in',
        token,
      }
    );
    
  } catch (err) {
    next(err);
  }
}

export async function getUserInformation (req, res, next) {
  try {
    const userId = req.user.userId;
    const user = await getUserInfo(userId);

    if (!user.rows[0]) {
      return res.status(404).json({ message: 'User not found'});
    }
    
    return res.status(200).json(user.rows[0]);
  } catch (err) {
    next(err);
  }
}

