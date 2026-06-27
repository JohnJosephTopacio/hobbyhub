declare global {
  interface AuthenticationPayload extends JwtPayload {
    userId: number;
  }
  namespace Express {
    interface Request {
      user?: AuthenticationPayload; 
    }
  }
}

export{}