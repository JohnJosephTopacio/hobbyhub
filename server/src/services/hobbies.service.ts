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

export async function processTagCreation(tag: TagRequest) {
  const tagName = tag.tag;
  const tagCategoryId = tag.categoryId;

  const tagDoesExists = await tagExists(tagName, tagCategoryId);
  if (tagDoesExists) {
    throw new TagExists();
  }

  const result = await insertTag(tagName, tagCategoryId);

  return await result.rows[0];
}
