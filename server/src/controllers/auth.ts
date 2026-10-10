import type { Request, Response, NextFunction } from 'express';
import { env } from '../config/env.js';

import {
  loginUserService,
  refreshTokenService,
  registerUserService,
} from '../services/auth.service.js';
import { registerUserSchema, loginUserSchema, refreshTokenSchema } from '../schemas/auth.schema.js';
import { parseClientMetadata } from '../services/clientMetadata.service.js';

// Token and cookie expiry minutes
const expiryDays = 15;

const REFRESH_COOKIE_PATH = '/auth/refresh';

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
    next(error);
  }
}

export async function loginUser(req: Request, res: Response, next: NextFunction) {
  try {
    const input = loginUserSchema.parse(req.body);
    const userAgent = req.headers['user-agent'];
    const clientMetadata = parseClientMetadata(userAgent, req.ip);

    const tokens = await loginUserService(input, clientMetadata);
    const { accessToken, refreshToken } = tokens;

    res
      .status(200)
      .cookie('token', refreshToken, {
        maxAge: expiryDays * 1000 * 60 * 60 * 24,
        httpOnly: true,
        // This needs to be revisited in the deployment phase for cross-site requests
        sameSite: 'strict',
        secure: env.NODE_ENV === 'production',
        path: REFRESH_COOKIE_PATH,
      })
      .json({
        message: 'User has logged in',
        accessToken: accessToken,
      });
  } catch (error) {
    next(error);
  }
}

export async function refreshToken(req: Request, res: Response, next: NextFunction) {
  const refreshTokenBody = refreshTokenSchema.parse(req.cookies.token);
  const { accessToken, refreshToken } = await refreshTokenService(refreshTokenBody);

  res
    .status(200)
    .cookie('token', refreshToken, {
      maxAge: expiryDays * 1000 * 60 * 60 * 24,
      httpOnly: true,
      // This needs to be revisited in the deployment phase for cross-site requests
      sameSite: 'strict',
      secure: env.NODE_ENV === 'production',
      path: REFRESH_COOKIE_PATH,
    })
    .json({ accessToken });
}
