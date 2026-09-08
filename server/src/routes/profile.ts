import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { addTag } from '../controllers/profile.js';

const profileRouter = Router();

profileRouter.post('/tags', authenticateToken, addTag);

export default profileRouter;
