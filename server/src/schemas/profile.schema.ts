import * as z from 'zod';

export const TagSchema = z.object({
  tagId: z.number('Invalid Tag ID format'),
});
