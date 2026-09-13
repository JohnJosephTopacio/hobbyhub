import { NoTagsFound, TagExists } from '../errors/index.js';
import {
  findCategoryTags,
  getActiveCategories,
  insertTag,
  tagExists,
} from '../repositories/hobbies.repository.js';
import { TagRequest } from '../schemas/hobbies.schema.js';

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

export async function processTagCreation({ tag, categoryId }: TagRequest) {
  const tagDoesExists = await tagExists(tag, categoryId);
  if (tagDoesExists) {
    throw new TagExists();
  }

  const result = await insertTag(tag, categoryId);

  return await result.rows[0];
}
