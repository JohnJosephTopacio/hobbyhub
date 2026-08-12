class AppError extends Error {
  readonly statusCode: number;
  readonly code: string;
  readonly internal?: {
    readonly message: string;
  };

  // The options parameter should be defaulted to an empty object so property access does not throw an error when no options object is passed as an argument
  constructor(message: string, statusCode: number, code: string, internalMessage?: string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    if (internalMessage) {
      this.internal = {
        message: internalMessage,
      };
    }

    // Cleaner Stack Trace that starts where the error was thrown, not at the AppError constructor
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
