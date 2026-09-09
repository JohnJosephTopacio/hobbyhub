import { deleteProfileTag, insertProfileTag } from '../repositories/profile.repository.js';

export function attachTagToProfile(userId: number, tagId: number) {
  return insertProfileTag(userId, tagId);
}

export function deleteTagFromProfile(userId: number, tagId: number) {
  return deleteProfileTag(userId, tagId);
}
