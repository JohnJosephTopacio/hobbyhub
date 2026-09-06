import type { Request, Response, NextFunction } from 'express';
import { fetchActiveCategories } from '../services/hobbies.service.js';

export async function getActiveCategories(req: Request, res: Response, next: NextFunction) {
  return res.status(200).json(await fetchActiveCategories());
}
