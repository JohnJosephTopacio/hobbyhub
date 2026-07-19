import * as z from 'zod';

export const registerUserSchema = z.strictObject({
  email: z.email(),
  // 5-20 characters. Only letters, numbers, hyphens, and underscores are allowed.
  username: z.string().regex(/^[a-zA-Z0-9_-]{5,20}$/),
  // Minimum 8 characters. At least one number, one lowercase, and one uppercase letter.
  password: z.string().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/),
});

export type RegisterBody = z.infer<typeof registerUserSchema>;
