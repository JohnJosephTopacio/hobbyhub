import { getActiveCategories } from '../repositories/hobbies.repository.js';

export async function fetchActiveCategories() {
  const activeCategories = await getActiveCategories();
  return activeCategories.rows;
}
