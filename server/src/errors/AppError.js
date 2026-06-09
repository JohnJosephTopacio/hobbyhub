class AppError extends Error {
  // The options parameter should be defaulted to an empty object so property access does not throw an error when no options object is passed as an argument
  constructor(message, statusCode, options={}) {
    super(message);
    this.statusCode = statusCode;
    // If the property is undefined or null, default to false
    this.expose = options.expose ?? false;
    this.code = options.code;

    // Cleaner Stack Trace that starts where the error was thrown, not at the AppError constructor 
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;