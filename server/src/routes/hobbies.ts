import { Router } from 'express';
import { getActiveCategories } from '../controllers/hobbies.js';

const hobbiesRouter = Router();

hobbiesRouter.get('/categories', getActiveCategories);

export default hobbiesRouter;
