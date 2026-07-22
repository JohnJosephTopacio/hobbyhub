import type { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';
import * as z from 'zod';

import { env } from '../config/env.js';
import pool from '../db/db.js';

import { registerUserService } from '../services/auth.service.js';
import { isRefreshPayload, RefreshPayload } from '../types/auth.js';
import { registerUserSchema } from '../schemas/auth.schema.js';
import { ValidationError } from '../errors/ValidationError.js';
import {
  getUserByEmail,
  storeRefreshToken,
  getRefreshTokenByJti,
  updateInactiveToken,
} from '../repositories/auth.repository.js';
import {
  MissingFields,
  EmailNotRegistered,
  IncorrectPassword,
  NoTokenProvided,
} from '../errors/index.js';

// Token and cookie expiry minutes
const expiryDays = 15;

export async function registerUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const input = registerUserSchema.parse(req.body);
    await registerUserService(input);
    
    /* 
    To be implemented in the future:
    check that @ exists and let the email verification step (confirmation email) do the real validation
    */

    res.status(201).json({ message: 'User has been created' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(new ValidationError(error));
      return;
    }
    next(error);
  }
}

export async function loginUser(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;

    // Check if required login fields exists
    if (!email || !password) {
      throw new MissingFields();
    }

    if (typeof email !== 'string' || typeof password !== 'string') {
      throw new Error('Invalid input formats.');
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
        jti,
      },
      env.JWT_REFRESH_SECRET,
      { expiresIn: '15d' },
    );

    // Time at the moment + 15 days
    const refreshTokenExpiry = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000);

    await storeRefreshToken(jti, userRecord.rows[0]!.id, refreshTokenExpiry);

    const accessToken = jwt.sign({ sub: userRecord.rows[0]!.id }, env.JWT_ACCESS_SECRET, {
      expiresIn: '5m',
    });

    res
      .status(200)
      .cookie('token', refreshToken, {
        // The first number is how many minutes the expression equates to
        maxAge: expiryDays * 1000 * 60 * 60 * 24,
        httpOnly: true,
        // This needs to be revisited in the deployment phase for cross-site requests
        sameSite: 'strict',
        secure: env.NODE_ENV === 'production',
        path: '/auth/refresh',
      })
      .json({
        message: 'User has logged in',
        accessToken: accessToken,
      });
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
    throw new Error('Refresh token does not match any token in the database.');
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
        jti: jti,
      },
      env.JWT_REFRESH_SECRET,
      { expiresIn: '15d' },
    );

    const expires_at = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000);

    storeRefreshToken(jti, Number(decoded.sub), expires_at);
    // COMMIT
    await client.query('COMMIT');
  } catch (error) {
    // ROLLBACK
    await client.query('ROLLBACK');
    next(error);
  }

  // RETURN NEW ACCESS TOKEN IN MEMORY AND NEW REFRESH TOKEN IN COOKIE
  const accessToken = jwt.sign({ sub: decoded.sub }, env.JWT_ACCESS_SECRET, {
    expiresIn: '5m',
  });

  if (newRefreshToken === '') {
    next(new Error('New refresh token missing'));
  }

  res
    .status(200)
    .cookie('token', newRefreshToken, {
      // The first number is how many minutes the expression equates to
      maxAge: expiryDays * 1000 * 60 * 60 * 24,
      httpOnly: true,
      // This needs to be revisited in the deployment phase for cross-site requests
      sameSite: 'strict',
      secure: env.NODE_ENV === 'production',
      path: '/auth/refresh',
    })
    .json({ accessToken });
}
