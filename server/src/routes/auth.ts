import { Router } from 'express';
import { registerUser, loginUser, refreshToken } from '../controllers/auth.js';

const authRouter = Router();

authRouter.post('/register', registerUser);
authRouter.post('/login', loginUser);
authRouter.get('/refresh', refreshToken);

export default authRouter;
