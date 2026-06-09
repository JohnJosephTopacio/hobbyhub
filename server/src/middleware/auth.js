  import jwt from 'jsonwebtoken';
  import { NoTokenProvided, InvalidToken } from '../errors/index.js'

  export function authenticateToken(req, res, next) {
    const token = req.cookies.token;
  
    try {
      if (!token) {
        throw new NoTokenProvided();
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          console.error('JWT.verify threw: ')
          console.error(err);
          throw new InvalidToken();
        }
        req.user = decoded;
      });
      
      next();
    } catch (err) {
      return next(err);
    }
  }