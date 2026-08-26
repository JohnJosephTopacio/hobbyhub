import { Request, Response, NextFunction } from 'express';
import { getProfileService, getUserService } from '../services/user.service.js';

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

    await getProfileService(req.user, username);

    return res.status(200);
  } catch (err) {
    return next(err);
  }
}

export async function updateProfile(req: Request, res: Response) {
  if (!req.user) {
    throw new Error('Missing req.user object.');
  }

  const userId = Number(req.user.sub);

  const updatedProfile = await updateProfileService(userId, req.body);

  res.status(200).json(updatedProfile);
}
