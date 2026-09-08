import { Request, Response, NextFunction } from 'express';
import {
  getProfileService,
  getTagsFromProfile,
  getUserService,
  updateProfileService,
} from '../services/user.service.js';
import { patchProfileSchema } from '../schemas/user.schema.js';

export async function getUserInformation(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw Error('Missing req.user object.');
    }

    const userId = Number(req.user.sub);
    const user = await getUserService(userId);

    res.status(200).json(user.rows[0]);
  } catch (err) {
    next(err);
  }
}

export async function getProfile(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw Error('Missing req.user object.');
    }

    const username = req.params.username;
    if (!(typeof username === 'string')) {
      throw Error('Invalid Username Format');
    }

    const userId = Number(req.user.sub);

    const profile = await getProfileService(userId, username);

    return res.status(200).json(profile);
  } catch (err) {
    return next(err);
  }
}

export async function updateProfile(req: Request, res: Response) {
  if (!req.user) {
    throw new Error('Missing req.user object.');
  }

  const userId = Number(req.user.sub);
  const patchBody = patchProfileSchema.parse(req.body);

  const updatedProfileRecord = await updateProfileService(userId, patchBody);

  res.status(200).json(updatedProfileRecord.rows[0]);
}

export async function getTags(req: Request, res: Response, next: NextFunction) {
  const userId = Number(req.user!.sub);
  const result = await getTagsFromProfile(userId);
  return result.rows;
}
