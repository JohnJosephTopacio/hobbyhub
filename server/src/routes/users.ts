import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { getProfile, getUserInformation } from '../controllers/users.js';

const usersRouter = Router();

usersRouter.get('/me', authenticateToken, getUserInformation);
usersRouter.get('/:username/profile', authenticateToken, getProfile);

export default usersRouter;
