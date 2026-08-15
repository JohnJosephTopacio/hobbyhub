import { Request, Response, NextFunction } from 'express';
import { getUserService } from '../services/user.service.js';
import { getUserProfile } from '../repositories/users.repository.js';

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

    console.log(`username: ${username}`);
    console.log(`authenticated user id: ${req.user.sub}`);
    const requestedUserProfileRecord = await getUserProfile(username);
    const requestedUser = requestedUserProfileRecord.rows[0]!;
    let isPrivate = true;
    let ownProfile = false;

    // If the user is visiting their own profile
    if (requestedUser.userId === Number(req.user.sub)) {
      ownProfile = true;
    }

    // Check if profile is private
    if (!requestedUser.private) {
      isPrivate = false;
    }

    return res.status(200);
  } catch (err) {
    return next(err);
  }
}
