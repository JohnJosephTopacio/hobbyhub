import type { Request, Response, NextFunction } from 'express';
import { TagParameterSchema, TagSchema } from '../schemas/profile.schema.js';
import { attachTagToProfile, deleteTagFromProfile } from '../services/profiles.service.js';

export async function addTag(req: Request, res: Response, next: NextFunction) {
  const tag = TagSchema.parse(req.body);
  const tagId = tag.tagId;
  const userId = Number(req.user!.sub);
  await attachTagToProfile(userId, tagId);
  return res.status(201).json({ message: 'Tag added' });
}

export async function deleteTag(req: Request, res: Response, next: NextFunction) {
  const tagId = TagParameterSchema.parse(Number(req.params.tagId));
  const userId = Number(req.user!.sub);

  await deleteTagFromProfile(userId, tagId);
  return res.status(204).json({ message: 'Tag removed' });
}
