import { Router } from 'express';
import { registerUser, loginUser, getUserInformation, refreshToken } from '../controllers/auth.js'
import { authenticateToken } from '../middleware/auth.js'

const authRouter = Router();

authRouter.get('/me', authenticateToken, getUserInformation);
authRouter.post('/register', registerUser);
authRouter.post('/login', loginUser);
authRouter.get('/refresh', refreshToken);

export default authRouter;
