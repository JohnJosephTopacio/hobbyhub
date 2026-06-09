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
    )
  }
}
