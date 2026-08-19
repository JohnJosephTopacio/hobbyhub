import { getUserInfo } from '../repositories/users.repository.js';
import { CouldNotFetchUser, UserNotFound } from '../errors/index.js';
import { AccessTokenPayload } from '../schemas/auth.schema.js';
import { getLimitedProfile, getUserProfile } from '../repositories/users.repository.js';

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

export async function getProfileService(user: AccessTokenPayload, username: string) {
  const requestedUserProfileRecord = await getUserProfile(username);
  const requestedUser = requestedUserProfileRecord.rows[0]!;

  // If the user is visiting their own profile
  if (requestedUser.userId === Number(user.sub)) {
    const userProfile = await getUserProfile(username);
    return userProfile;

    // if not their own profile and is private
  } else if (!requestedUser.private) {
    const limitedProfile = await getLimitedProfile(username);
    return limitedProfile;
  }
}
