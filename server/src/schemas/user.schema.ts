import * as z from 'zod';

export const usernameSchema = z
  .string()
  .regex(
    /^[a-zA-Z0-9_-]{5,20}$/,
    'Username must be 5-20 characters. Only letters, numbers, hyphens, and underscores are allowed',
  );
