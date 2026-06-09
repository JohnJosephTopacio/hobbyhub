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
        code: 'invalidToken'
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
      'Invalid Username Format.',
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
      'Email is already registered.',
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
        code: 'userRegistered',
      }
    );
  }
}


