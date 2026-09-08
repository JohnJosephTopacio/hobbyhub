import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { addTag } from '../controllers/profile.js';
import { updateProfile } from '../controllers/users.js';

const profileRouter = Router();

profileRouter.patch('/', authenticateToken, updateProfile);
profileRouter.post('/tags', authenticateToken, addTag);

export default profileRouter;
