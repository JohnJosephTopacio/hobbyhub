import type { Request, Response, NextFunction } from 'express';
import {
  fetchActiveCategories,
  loadCategoryTags,
  processTagCreation,
} from '../services/hobbies.service.js';
import { CategorySlug, Tag } from '../schemas/hobbies.schema.js';

export async function getActiveCategories(req: Request, res: Response, next: NextFunction) {
  return res.status(200).json(await fetchActiveCategories());
}

export async function getCategoryTags(req: Request, res: Response, next: NextFunction) {
  const categorySlug = CategorySlug.parse(req.params.categorySlug);
  return res.status(200).json(await loadCategoryTags(categorySlug));
}

export async function createTag(req: Request, res: Response, next: NextFunction) {
  const tag = Tag.parse(req.body);
  console.log(req.body);
  return res.status(201).json(await processTagCreation(tag));
}
