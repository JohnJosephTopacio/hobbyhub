import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { getProfile, getTags, getUserInformation } from '../controllers/users.js';

const usersRouter = Router();

usersRouter.get('/me', authenticateToken, getUserInformation);
usersRouter.get('/:username/profile', authenticateToken, getProfile);
usersRouter.get('/:username/tags', authenticateToken, getTags);

export default usersRouter;
