import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { NoTokenProvided } from '../errors/index.js';
import type { Request, Response, NextFunction } from 'express';

export function authenticateToken(req: Request, _res: Response, next: NextFunction) {
  const token = req.cookies.token;
  const secret = env.JWT_SECRET;

  try {
    if (!token) {
      throw new NoTokenProvided();
    }

    const decoded = jwt.verify(token, secret);
    req.user = decoded as AuthenticationPayload;
    
    next();
  } catch (err) {
    return next(err);
  }
}