import type { Request, Response, NextFunction } from 'express';
import { TagSchema } from '../schemas/profile.schema.js';
import { attachTagToProfile } from '../services/profiles.service.js';

export async function addTag(req: Request, res: Response, next: NextFunction) {
  const tag = TagSchema.parse(req.body);
  const tagId = tag.tagId;
  const userId = Number(req.user!.sub);
  await attachTagToProfile(userId, tagId);
  return res.status(201).json({ message: 'Tag added' });
}
