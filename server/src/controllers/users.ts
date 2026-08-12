import { Request, Response, NextFunction } from 'express';
import { getUserService } from '../services/user.service.js';

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
