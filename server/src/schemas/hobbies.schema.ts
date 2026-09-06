import * as z from 'zod';

export const CategorySlug = z.string('Invalid Category Slug');
export const Tag = z.strictObject({
  tag: z.string('Invalid Tag Format'),
  categoryId: z.number('Invalid category ID'),
});

export type TagRequest = z.infer<typeof Tag>;
