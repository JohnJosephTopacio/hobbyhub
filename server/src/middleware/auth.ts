import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { NoTokenProvided, InvalidToken } from '../errors/index.js';
import type { Request, Response, NextFunction } from 'express';
import { accessTokenPayloadSchema } from '../schemas/auth.schema.js';

export function authenticateToken(req: Request, _res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  const secret = env.JWT_ACCESS_SECRET;

  if (!token) {
    throw new NoTokenProvided();
  }

  try {
    const decoded = jwt.verify(token, secret);
    req.user = accessTokenPayloadSchema.parse(decoded);
    next();
  } catch (err) {
    if (err instanceof Error) {
      if (err.name === 'TokenExpiredError' || err.name === 'JsonWebTokenError') {
        next(new InvalidToken());
      }
    }
    return next(err);
  }
}
