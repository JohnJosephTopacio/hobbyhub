import { JwtPayload } from 'jsonwebtoken';
import { AccessTokenPayload } from '../schemas/auth.schema.ts';

declare global {
  namespace Express {
    interface Request {
      user?: AccessTokenPayload;
    }
  }
}

export {};
