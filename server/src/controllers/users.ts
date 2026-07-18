import { Request, Response, NextFunction } from 'express';
import { getUserInfo } from '../repositories/auth.repository.js';
import { CouldNotFetchUser, UserNotFound } from '../errors/index.js';

export async function getUserInformation(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw Error('Missing req.user object.');
    }

    const userId: number = Number(req.user.sub);
    let user;
    try {
      user = await getUserInfo(userId);
    } catch (err) {
      console.error(err);
      throw new CouldNotFetchUser();
    }

    if (!user.rows[0]) {
      throw new UserNotFound();
    }

    res.status(200).json(user.rows[0]);
  } catch (err) {
    next(err);
  }
}
