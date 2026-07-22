import bcrypt from 'bcryptjs';
import {
  checkUserExistsByEmail,
  checkUserExistsByUsername,
  insertUserAndCreateProfile,
} from '../repositories/auth.repository.js';
import { EmailRegistered, UsernameRegistered } from '../errors/index.js';
import { RegisterBody } from '../schemas/auth.schema.js';

export async function registerUserService(input: RegisterBody) {
  // Check if email is already registered
  const { email, username, password } = input;
  const emailRecord = await checkUserExistsByEmail(email);
  if (emailRecord.rowCount !== 0) {
    throw new EmailRegistered();
  }

  // Check if username already exists
  const usernameRecord = await checkUserExistsByUsername(username);
  if (usernameRecord.rowCount !== 0) {
    throw new UsernameRegistered();
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create the user in the users table
  await insertUserAndCreateProfile(email, username, hashedPassword);
}
