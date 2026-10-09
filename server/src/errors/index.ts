import AppError from './AppError.js';

export class NoTokenProvided extends AppError {
  constructor() {
    super('No token was provided', 401, 'noTokenProvided');
  }
}

export class InvalidToken extends AppError {
  constructor() {
    super('Invalid or expired token', 401, 'invalidOrExpiredToken');
  }
}

export class MissingFields extends AppError {
  constructor() {
    super('Missing required input fields', 400, 'missingFields');
  }
}

export class InvalidEmailFormat extends AppError {
  constructor() {
    super('Invalid email format', 400, 'invalidEmailFormat');
  }
}

export class InvalidUsernameFormat extends AppError {
  constructor() {
    super('Invalid username format', 400, 'invalidUsernameFormat');
  }
}

export class EmailRegistered extends AppError {
  constructor() {
    super('Email already registered', 409, 'emailRegistered');
  }
}

export class UsernameRegistered extends AppError {
  constructor() {
    super('Username already registered', 409, 'usernameRegistered');
  }
}

export class IncorrectPassword extends AppError {
  constructor() {
    super('Invalid Email or Password', 401, 'invalidEmailOrPassword', 'Incorrect Password');
  }
}

export class EmailNotRegistered extends AppError {
  constructor() {
    super(
      'Invalid Email or Password',
      404,
      'invalidEmailOrPassword',
      'No user account was found registered using email.',
    );
  }
}

export class UserNotFound extends AppError {
  constructor() {
    super('User not found', 404, 'userNotFound');
  }
}

export class CouldNotFetchUser extends AppError {
  constructor() {
    super('Could not fetch the user', 500, 'fetchUserFailed');
  }
}

export class EnvironmentVariableMissing extends AppError {
  constructor() {
    super('Internal Error', 500, 'internalError', 'Environment variable is Missing');
  }
}

export class NoTagsFound extends AppError {
  constructor() {
    super('No Tags Found', 404, 'noTagsFound', 'No Tags under the Category were found');
  }
}

export class TagExists extends AppError {
  constructor() {
    super('Tag Exists Already', 409, 'tagExistsAlready', 'Attempting to create a tag that exists');
  }
}

export class InvalidPayloadShape extends AppError {
  constructor() {
    super(
      'Invalid Token Payload',
      400,
      'invalidTokenPayload',
      'The decoded token payload shape is invalid',
    );
  }
}
