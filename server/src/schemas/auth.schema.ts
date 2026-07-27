import * as z from 'zod';

export const registerUserSchema = z.strictObject({
  email: z.email('Invalid Email Format'),
  // 5-20 characters. Only letters, numbers, hyphens, and underscores are allowed.
  username: z
    .string('Invalid Username Format')
    .regex(
      /^[a-zA-Z0-9_-]{5,20}$/,
      'Username must be 5-20 characters. Only letters, numbers, hyphens, and underscores are allowed',
    ),
  // Minimum 8 characters. At least one number, one lowercase, and one uppercase letter.
  password: z
    .string('Invalid Password Format')
    .regex(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
      'Minimum 8 characters. At least one number, one lowercase, and one uppercase letter',
    ),
});

export const loginUserSchema = z.strictObject({
  email: z.email('Invalid Email Format'),
  password: z.string('Invalid Password Format'),
});

export const refreshTokenSchema = z.string('Invalid Token Format');

export type RegisterBody = z.infer<typeof registerUserSchema>;
export type LoginBody = z.infer<typeof loginUserSchema>;
