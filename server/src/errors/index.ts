import AppError from './AppError.js'

export class NoTokenProvided extends AppError {
  constructor() {
    super(
      'No token was provided.',
      401,
      {
        expose: false,
        code: 'tokenDoesNotExist'
      }
    );
  }
}

export class InvalidToken extends AppError {
  constructor() {
    super(
      'Invalid or expired token.',
      401,
      {
        expose: false,
        code: 'invalidToken',
      }
    );
  }
}

export class MissingFields extends AppError {
  constructor() {
    super(
      'Missing required input fields.',
      400,
      {
        expose: true,
        code: 'missingFields'
      }
    );
  }
}

export class InvalidEmailFormat extends AppError {
  constructor() {
    super(
      'Invalid email format.',
      400,
      {
        expose: true,
        code: 'invalidEmail'
      }
    );
  }
}

export class InvalidUsernameFormat extends AppError {
  constructor() {
    super(
      'Invalid username format.',
      400, 
      {
        expose: true,
        code: 'invalidUsername'
      }
    )
  }
}

export class EmailRegistered extends AppError {
  constructor() {
    super (
      'Email already registered.',
      409,
      {
        expose: true,
        code: 'emailRegistered'
      }
    );
  }
}

export class UsernameRegistered extends AppError {
  constructor() {
    super (
      'Username already registered.',
      409,
      {
        expose: true,
        code: 'usernameRegistered',
      }
    );
  }
}

export class IncorrectPassword extends AppError {
  constructor() {
    super (
      'Incorrect password.',
      401,
      {
        expose: false,
        code: 'incorrectPassword',
        protectedCode: 'invalidEmailOrPassword',
        protectedMessage: 'Invalid Email or Password.',
      }
    );
  }
}

export class EmailNotRegistered extends AppError {
  constructor() {
    super (
      'No user account was found registered using email.',
      404,
      {
        expose: false,
        code: 'emailNotRegistered',
        protectedCode: 'invalidEmailOrPassword',
        protectedMessage: 'Invalid Email or Password.',
        protectedStatusCode: 401
      }
    )
  }
}

export class UserNotFound extends AppError {
  constructor() {
    super ( 
      'User not found.',
      404,
      {
        expose: false,
        code: 'userNotFound',
      }
    );
  }
}

export class CouldNotFetchUser extends AppError {
  constructor() {
    super (
      'Could not fetch the user.',
      500,
      {
        expose: false,
        code: 'fetchUserFailed'
      }
    );
  }
}

export class EnvironmentVariableMissing extends AppError {
  constructor() {
    super (
      'Environment variable is missing.',
      500,
      {
        expose: false,
        code: 'environmentVariableMissing'
      }
    )
  }
}





