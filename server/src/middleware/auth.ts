import jwt, { JwtPayload } from 'jsonwebtoken';
import { env } from '../config/env.js';
import { NoTokenProvided } from '../errors/index.js';
import type { Request, Response, NextFunction } from 'express';

export function authenticateToken(req: Request, _res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  const secret = env.JWT_ACCESS_SECRET;

  if (!token) {
    throw new NoTokenProvided();
  }

  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded as JwtPayload;
    
    next();
  } catch (err) {
    return next(err);
  }
}