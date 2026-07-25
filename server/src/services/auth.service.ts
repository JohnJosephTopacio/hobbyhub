import bcrypt from 'bcryptjs';
import { env } from '../config/env.js';
import { EmailRegistered, UsernameRegistered } from '../errors/index.js';
import { RegisterBody } from '../schemas/auth.schema.js';
import {
  userExistsByEmail,
  userExistsByUsername,
  createUserWithProfile,
} from '../repositories/auth.repository.js';

export async function registerUserService(input: RegisterBody): Promise<void> {
  // Check if email is already registered
  const { email, username, password } = input;
  const emailExists = await userExistsByEmail(email);
  if (emailExists) {
    throw new EmailRegistered();
  }

  // Check if username already exists
  const usernameExists = await userExistsByUsername(username);
  if (usernameExists) {
    throw new UsernameRegistered();
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, env.BCRYPT_COST_FACTOR ?? 10);

  // Create the user in the users table
  await createUserWithProfile(email, username, hashedPassword);
}
