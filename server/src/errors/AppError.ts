interface AppErrorOptions {
  expose?: boolean;
  code?: string;
  protectedCode?: string;
  protectedMessage?: string;
  protectedStatusCode?: number;
};

class AppError extends Error { 
  readonly name: string;
  readonly statusCode: number;
  readonly expose: boolean;
  readonly code: string;
  readonly internal: {
    readonly code: string | null,
    readonly message: string | null,
    readonly statusCode: number | null
  }

  // The options parameter should be defaulted to an empty object so property access does not throw an error when no options object is passed as an argument
  constructor(message: string, statusCode: number, options: AppErrorOptions={}) {
    super(message);
    this.name = this.constructor.name; 
    this.statusCode = statusCode;
    // If the property is undefined or null, default to false
    this.expose = options.expose ?? false;
    this.code = options.code ?? 'internalError';
    this.internal = {
      code: options.protectedCode ?? null,
      message: options.protectedMessage ?? null,
      statusCode: options.protectedStatusCode ?? null
    }

    // Cleaner Stack Trace that starts where the error was thrown, not at the AppError constructor 
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;