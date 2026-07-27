import bcrypt from 'bcryptjs';
import { env } from '../config/env.js';
import {
  EmailRegistered,
  UsernameRegistered,
  EmailNotRegistered,
  IncorrectPassword,
} from '../errors/index.js';
import { RegisterBody, LoginBody } from '../schemas/auth.schema.js';
import {
  userExistsByEmail,
  userExistsByUsername,
  createUserWithProfile,
  getUser,
  storeRefreshToken,
} from '../repositories/auth.repository.js';
import { createAccessToken, createRefreshToken } from './token.service.js';

interface TokenSet {
  accessToken: string;
  refreshToken: string;
}

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

export async function loginUserService(input: LoginBody): Promise<TokenSet> {
  const { email, password } = input;
  const userAuthRecord = await getUser(email);

  // Check if the email is not registered
  if (!userAuthRecord.rows[0]) {
    throw new EmailNotRegistered();
  }

  const user = userAuthRecord.rows[0];
  const hashedPassword = user.password;

  // Hash the incoming password and compare it to the hashed password in the database, if it does not match send an error
  const isPasswordCorrect = await bcrypt.compare(password, hashedPassword);

  if (!isPasswordCorrect) {
    throw new IncorrectPassword();
  }

  // JTI means JWT ID
  const jti = crypto.randomUUID();

  // If all is well, the user is logged on - send back JWT Token
  const refreshToken = createRefreshToken(user.id, jti);

  // Time at the moment + 15 days
  const refreshTokenExpiry = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000);
  await storeRefreshToken(jti, user.id, refreshTokenExpiry);

  const accessToken = createAccessToken(user.id);
  return { accessToken, refreshToken };
}
