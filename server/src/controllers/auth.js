
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { checkUserExistsByEmail, checkUserExistsByUsername, insertUser, getUserByEmail, getUserInfo } from '../db/queries/authQueries.js';
import { MissingFields, InvalidEmailFormat, InvalidUsernameFormat, EmailRegistered, UsernameRegistered } from '../errors/index.js'

// Token and cookie expiry minutes
const expiryMinutes = 15;

export async function registerUser(req, res, next) {
  try {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const { email, username, password } = req.body;
  
    // Check if required register fields exist on the response body 
    if ( !email || !username || !password ) {
      throw new MissingFields();
    }

    // Check if email format is proper
    if (!regex.test(email)) {
      throw new InvalidEmailFormat();
    }

    // Check if username is proper
    const usernameRegex = /^[a-zA-Z][a-zA-Z0-9_]{5,15}$/;
    if (!usernameRegex.test(username)) {
      throw new InvalidUsernameFormat();
    }
  
    /* 
    To be implemented in the future:
    
    check that @ exists and let the email verification step (confirmation email) do the real validation

    */

    // Check if email is already registered
    const emailRecord = await checkUserExistsByEmail(email);
    if (emailRecord.rowCount !== 0) {
      throw new EmailRegistered();
    }
    
    // Check if username already exists
    const usernameRecord = await checkUserExistsByUsername(username);
    if (usernameRecord.rowCount !== 0) {
      throw new UsernameRegistered();
    }
  
    // Hash the password 
    const hashedPassword = await bcrypt.hash(password, 10)
  
    // Create the user in the users table
    await insertUser(email, username, hashedPassword);
    res.status(201).json({message: 'User has been created'});

  } catch (err) {
    next(err);
  }
}

export async function loginUser(req, res, next) {
  try {
    const { email, password } = req.body;
  
    // Check if required login fields exists
    if (!email || !password) {
      return next(new AppError('missingFields', 400, 'All input fields are required', true));
    }

    // Check if the email is registered
    const userRecord = await getUserByEmail(email);
    if (userRecord.rowCount === 0) {
  
      return next(new AppError('invalidCredentials', 401, ''))

    } 

    const hashedPassword = userRecord.rows[0].password;

    // Hash the incoming password and compare it to the hashed password in the database, if it does not match send an error
    const isPasswordCorrect = await bcrypt.compare(password, hashedPassword);
    
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Invalid Email or Password.'});
    }
    
    // If all is well, the user is logged on - send back JWT Token
    const token = jwt.sign(
      { userId: userRecord.rows[0].id,}, 
      process.env.JWT_SECRET,
      { expiresIn: expiryMinutes * 60 }
    );

    return res.status(200)
    .cookie(
      'token', 
      token, 
      {
        // The first number is how many minutes the expression equates to 
        maxAge: expiryMinutes * 60 * 1000,
        httpOnly: true,
        // This needs to be revisited in the deployment phase for cross-site requests
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production' 
      }
    )
    .json(
      { 
        message: 'User has logged in',
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
      return next(new AppError('userNotFound', 404, 'Could not fetch the user record', true))
    }
    
    return res.status(200).json(user.rows[0]);
  } catch (err) {
    next(err);
  }
}

