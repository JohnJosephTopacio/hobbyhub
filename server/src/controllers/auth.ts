import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';
import { env } from '../config/env.js'
import { checkUserExistsByEmail, checkUserExistsByUsername, insertUserAndCreateProfile, getUserByEmail, getUserInfo, storeRefreshToken, getRefreshTokenByJti, updateInactiveToken} from '../repositories/authQueries.js';
import { MissingFields, InvalidEmailFormat, InvalidUsernameFormat, EmailRegistered, UsernameRegistered, EmailNotRegistered, IncorrectPassword, UserNotFound, CouldNotFetchUser, NoTokenProvided } from '../errors/index.js'
import crypto from 'node:crypto'
import { isRefreshPayload, RefreshPayload } from '../types/auth.js';
import pool from '../db/db.js';

// Token and cookie expiry minutes
const expiryDays = 15;

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
    
    // JTI means JWT ID 
    const jti = crypto.randomUUID();

    // If all is well, the user is logged on - send back JWT Token
    const refreshToken = jwt.sign(
      { 
        sub: userRecord.rows[0]!.id,
        jti
      }, 
      env.JWT_REFRESH_SECRET,
      { expiresIn: '15d' }
    );
    
    // Time at the moment + 15 days
    const refreshTokenExpiry = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000);

    await storeRefreshToken(jti, userRecord.rows[0]!.id, refreshTokenExpiry);
    
    const accessToken = jwt.sign(
      { sub: userRecord.rows[0]!.id,}, 
      env.JWT_ACCESS_SECRET,
      { expiresIn: '5m' }
    );

    res.status(200)
    .cookie(
      'token', 
      refreshToken, 
      {
        // The first number is how many minutes the expression equates to 
        maxAge: expiryDays * 1000 * 60 * 60 * 24,
        httpOnly: true,
        // This needs to be revisited in the deployment phase for cross-site requests
        sameSite: 'strict',
        secure: env.NODE_ENV === 'production',
        path: '/auth/refresh'
      }
    )
    .json(
      { 
        message: 'User has logged in',
        accessToken: accessToken
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

    const userId: number  = Number(req.user.sub);
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

export async function refreshToken(req: Request, res: Response, next: NextFunction) {
  const refreshToken: string | undefined = req.cookies.token;
  if (!refreshToken) {
    throw new NoTokenProvided();
  }

  let decoded: RefreshPayload;
  try {
    const verified = await jwt.verify(refreshToken, env.JWT_REFRESH_SECRET);
    if (isRefreshPayload(verified)) {
      decoded = verified;
    } else {
      throw Error('Invalid Refresh Token Payload Shape');
    }
  } catch (err) {
    return next(err);
  }

  // CHECK IF REFRESH TOKEN MATCHES ANY REFRESH TOKEN IN THE DATABASE
  const tokenRecord = await getRefreshTokenByJti(decoded.jti);

  if (tokenRecord.rows.length < 1) {
    throw new Error('Refresh token does not match any token in the database.')
  }

  // CHECK IF TOKEN MATCHED IS NOT REVOKED 
  if (tokenRecord.rows[0]!.token_status === 'REVOKED') {
    // TODO: log all user sessions, a malicious actor may be trying to get in

    throw new Error('Refresh token has been revoked.');
  }

  // CHECK EXPIRY
  if (tokenRecord.rows[0]!.expires_at < new Date()) {
    throw new Error('Refresh Token has expired.');
  }

  const client = await pool.connect();
  let newRefreshToken: string = '';

  try {
    // BEGIN TRANSACTION - note: Lock the row to handle race condition
    await client.query('BEGIN');
    // MAKE OLD REFRESH TOKEN INACTIVE 
    updateInactiveToken(decoded.jti, client);
    // SIGN AND STORE NEW REFRESH TOKEN IN DATABASE
    const jti = crypto.randomUUID();
    newRefreshToken = jwt.sign(
      { 
        sub: decoded.sub,
        jti: jti
      }, 
      env.JWT_REFRESH_SECRET,
      { expiresIn: '15d' }
    );
    
    const expires_at = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000);

    storeRefreshToken(jti, Number(decoded.sub), expires_at)
    // COMMIT
    await client.query('COMMIT');
  } catch (error) {
    // ROLLBACK
    await client.query('ROLLBACK');
    next(error);
  }
  
  // RETURN NEW ACCESS TOKEN IN MEMORY AND NEW REFRESH TOKEN IN COOKIE
  const accessToken = jwt.sign(
    { sub: decoded.sub,}, 
    env.JWT_ACCESS_SECRET,
    { expiresIn: '5m' }
  );

  if (newRefreshToken === '') {
    next(new Error('New refresh token missing'));
  }

  res.status(200)
  .cookie(
    'token', 
    newRefreshToken, 
    {
      // The first number is how many minutes the expression equates to 
      maxAge: expiryDays * 1000 * 60 * 60 * 24,
      httpOnly: true,
      // This needs to be revisited in the deployment phase for cross-site requests
      sameSite: 'strict',
      secure: env.NODE_ENV === 'production',
      path: '/auth/refresh'
    }
  )
  .json({ accessToken });
} 