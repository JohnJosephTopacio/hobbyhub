import { Router } from 'express';
import { registerUser, loginUser, getUserInformation } from '../controllers/auth.js'
import { authenticateToken } from '../middleware/auth.js'
import cors from 'cors';

// credentials field must be set to true for Access-Control-Allow-Credentials to be attached to header
const corsCredentials = {
  origin: process.env.FRONTEND_SERVER_URL,
  credentials: true,
}

const authRouter = Router();

authRouter.get('/me', cors(corsCredentials), authenticateToken, getUserInformation)

authRouter.post('/register', registerUser);
authRouter.post('/login', loginUser);

export default authRouter;
