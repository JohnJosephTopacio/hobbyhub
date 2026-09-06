import { NoTagsFound } from '../errors/index.js';
import { findCategoryTags, getActiveCategories } from '../repositories/hobbies.repository.js';

export async function fetchActiveCategories() {
  const activeCategories = await getActiveCategories();
  return activeCategories.rows;
}

export async function loadCategoryTags(categorySlug: string) {
  const categoryTags = await findCategoryTags(categorySlug);
  console.log(categoryTags);
  if (categoryTags.rows.length === 0) {
    throw new NoTagsFound();
  }
  return categoryTags.rows;
}
