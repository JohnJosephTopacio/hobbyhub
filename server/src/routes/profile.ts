import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { addTag, deleteTag } from '../controllers/profile.js';
import { updateProfile } from '../controllers/users.js';

const profileRouter = Router();

profileRouter.patch('/', authenticateToken, updateProfile);
profileRouter.post('/tags', authenticateToken, addTag);
profileRouter.delete('/tags/:tagId', authenticateToken, deleteTag);

export default profileRouter;
