import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';
import { env } from '../config/env.js'
import { checkUserExistsByEmail, checkUserExistsByUsername, insertUserAndCreateProfile, getUserByEmail, getUserInfo} from '../db/queries/authQueries.js';
import { MissingFields, InvalidEmailFormat, InvalidUsernameFormat, EmailRegistered, UsernameRegistered, EmailNotRegistered, IncorrectPassword, UserNotFound, CouldNotFetchUser } from '../errors/index.js'

// Token and cookie expiry minutes
const expiryMinutes = 15;

export async function registerUser(req: Request, res: Response, next: NextFunction): Promise<void> {
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
    await insertUserAndCreateProfile(email, username, hashedPassword);
    res.status(201).json({message: 'User has been created'});

  } catch (err) {
    next(err);
  }
}

export async function loginUser(req: Request, res: Response, next: NextFunction){
  try {
    const { email , password  } = req.body;
  
    // Check if required login fields exists
    if (!email || !password) {
      throw new MissingFields();
    }

    if (typeof email !== 'string'|| typeof password !== 'string' ) {
      throw new Error('Invalid input formats.')
    }

    const userRecord = await getUserByEmail(email);
    
    // Check if the email is not registered
    if (!userRecord.rowCount) {
      throw new EmailNotRegistered();
    } 

    // if rowCount is not 0 or null, .rows[0] must exist
    const hashedPassword = userRecord.rows[0]!.password;

    // Hash the incoming password and compare it to the hashed password in the database, if it does not match send an error
    const isPasswordCorrect = await bcrypt.compare(password, hashedPassword);
    
    if (!isPasswordCorrect) {
      throw new IncorrectPassword();
    }
    
    // If all is well, the user is logged on - send back JWT Token
    const token = jwt.sign(
      { userId: userRecord.rows[0]!.id,}, 
      env.JWT_SECRET,
      { expiresIn: expiryMinutes * 60 }
    );

    res.status(200)
    .cookie(
      'token', 
      token, 
      {
        // The first number is how many minutes the expression equates to 
        maxAge: expiryMinutes * 60 * 1000,
        httpOnly: true,
        // This needs to be revisited in the deployment phase for cross-site requests
        sameSite: 'strict',
        secure: env.NODE_ENV === 'production' 
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

export async function getUserInformation (req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw Error('Missing req.user object.');
    }

    const userId: number  = req.user.userId;
    let user;
    try {
      user = await getUserInfo(userId);
    } catch (err) {
      console.error(err);
      throw new CouldNotFetchUser();
    }
    
    if (!user.rows[0]) {
      throw new UserNotFound();
    }

    res.status(200).json(user.rows[0]);
  } catch (err) {
    next(err); 
  }
}

