import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { getProfile, getUserInformation, updateProfile } from '../controllers/users.js';

const usersRouter = Router();

usersRouter.get('/me', authenticateToken, getUserInformation);
usersRouter.get('/:username/profile', authenticateToken, getProfile);
usersRouter.patch('/profile', authenticateToken, updateProfile);

export default usersRouter;
