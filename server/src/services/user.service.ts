import { getUserInfo } from '../repositories/auth.repository.js';
import { CouldNotFetchUser, UserNotFound } from '../errors/index.js';

export async function getUserService(userId: number) {
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

  return user;
}
