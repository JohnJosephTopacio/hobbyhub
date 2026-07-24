import bcrypt from 'bcryptjs';
import { env } from '../config/env.js';
import { EmailRegistered, UsernameRegistered } from '../errors/index.js';
import { RegisterBody } from '../schemas/auth.schema.js';
import {
  findUserByEmail,
  findUserByUsername,
  insertUserAndCreateProfile,
} from '../repositories/auth.repository.js';

export async function registerUserService(input: RegisterBody): Promise<void> {
  // Check if email is already registered
  const { email, username, password } = input;
  const emailExists = await findUserByEmail(email);
  if (!emailExists) {
    throw new EmailRegistered();
  }

  // Check if username already exists
  const usernameRecord = await findUserByUsername(username);
  if (usernameRecord.rowCount !== 0) {
    throw new UsernameRegistered();
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, env.BCYRPT_COST_FACTOR ?? 10);

  // Create the user in the users table
  await insertUserAndCreateProfile(email, username, hashedPassword);
}
