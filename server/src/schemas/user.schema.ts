import * as z from 'zod';

export const usernameSchema = z
  .string()
  .regex(
    /^[a-zA-Z0-9_-]{5,20}$/,
    'Username must be 5-20 characters. Only letters, numbers, hyphens, and underscores are allowed',
  );

export const patchProfileSchema = z
  .object({
    avatarUrl: z.httpUrl().nullable().optional(),
    coverUrl: z.httpUrl().nullable().optional(),
    bio: z.string().max(500).nullable().optional(),
    private: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update.',
    path: [],
  });

export type PatchProfileBody = z.infer<typeof patchProfileSchema>;
