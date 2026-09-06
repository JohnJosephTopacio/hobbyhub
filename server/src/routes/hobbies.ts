import { Router } from 'express';
import { createTag, getActiveCategories, getCategoryTags } from '../controllers/hobbies.js';
import { authenticateToken } from '../middleware/auth.js';

const hobbiesRouter = Router();

hobbiesRouter.get('/categories', getActiveCategories);
hobbiesRouter.get('/:categorySlug/tags', getCategoryTags);
hobbiesRouter.post('/tags', authenticateToken, createTag);

export default hobbiesRouter;
