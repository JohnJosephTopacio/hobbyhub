import { Router } from 'express';
import { getActiveCategories, getCategoryTags } from '../controllers/hobbies.js';

const hobbiesRouter = Router();

hobbiesRouter.get('/categories', getActiveCategories);
hobbiesRouter.get('/:categorySlug/tags', getCategoryTags);

export default hobbiesRouter;
