import { getUserInfo, updateProfile } from '../repositories/users.repository.js';
import { CouldNotFetchUser, UserNotFound } from '../errors/index.js';
import { getLimitedProfile, getUserProfile } from '../repositories/users.repository.js';
import { PatchProfileBody } from '../schemas/user.schema.js';

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

export async function getProfileService(userId: number, username: string) {
  const requestedUserProfileRecord = await getUserProfile(username);
  const requestedUser = requestedUserProfileRecord.rows[0]!;

  // If the user is visiting their own profile or the user is public
  if (requestedUser.userId === Number(userId) || !requestedUser.private) {
    const userProfile = await getUserProfile(username);
    return userProfile;

    // if not their own profile and is private
  } else {
    const limitedProfile = await getLimitedProfile(username);
    return limitedProfile;
  }
}

export async function updateProfileService(userId: number, input: PatchProfileBody) {
  return updateProfile(userId, input);
}
