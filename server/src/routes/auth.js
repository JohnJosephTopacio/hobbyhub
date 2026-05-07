import { Router } from 'express';
import { registerUser, loginUser, getUserInformation } from '../controllers/auth.js'
import { authenticateToken } from '../middleware/auth.js'
const authRouter = Router();

authRouter.get('/me', authenticateToken, getUserInformation)

authRouter.post('/register', registerUser);
authRouter.post('/login', loginUser);


export default authRouter;
