import { insertProfileTag } from '../repositories/profile.repository.js';

export function attachTagToProfile(userId: number, tagId: number) {
  return insertProfileTag(userId, tagId);
}
