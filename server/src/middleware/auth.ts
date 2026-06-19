import jwt from 'jsonwebtoken';
import type { JwtPayload } from 'jsonwebtoken';
import { EnvironmentVariableMissing, NoTokenProvided } from '../errors/index.js'
import type { Request, Response, NextFunction } from 'express';

declare global {
  namespace Express {
    interface Request {
      user: string | JwtPayload | undefined
    }
  }
}

export function authenticateToken(req: Request, _res: Response, next: NextFunction) {
  const token = req.cookies.token;
  const secret = process.env.JWT_SECRET;

  try {
    if (secret === undefined) {
      throw new EnvironmentVariableMissing();
    }
    
    if (!token) {
      throw new NoTokenProvided();
    }

    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    
    next();
    
  } catch (err) {
    return next(err);
  }
}