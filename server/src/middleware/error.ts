import AppError from '../errors/AppError.js'
import type { Request, Response, NextFunction } from 'express';

/* things to add: 
  Production Logger
  Request Context / Unique Request ID generation
  Error Monitoring
*/ 

export function errorHandler (err: Error, _req: Request, res: Response, _next: NextFunction) {
  // if err is a standard Error object
  if (!(err instanceof AppError)) {
    let statusCode = 500;

    if ('status' in err) {
      if (typeof err.status === 'number'){
        statusCode = err.status;
      } 
    }

    if ('statusCode' in err) {
      if (typeof err.statusCode === 'number'){
        statusCode = err.statusCode;
      } 
    }

    console.error(err);
    console.error('Status: ' + statusCode);
    return res.status(statusCode).json(
      {
        code: 'internalError',
        message: 'Internal error.'
      }
    )
  }

  if (process.env.NODE_ENV === "dev" || process.env.NODE_ENV === "development") {
    // .log and .error writes to different streams which just means they can be configured to go different places for different uses. Also they may differ in formatting
    const statusCode = err.statusCode;
    console.error(err);
    console.error('Status: ' + statusCode);
    return res.status(statusCode).json(
      {
        message: err.message, 
        stack: err.stack,
        statusCode,
        code: err.code,
      });
  } 
  
  if (process.env.NODE_ENV === 'production') { 
    const statusCode = err.statusCode;
    console.error(err);
    console.error('Status: ' + statusCode);

    if (err.expose === true) {
      return res.status(statusCode).json(
        {
          code: err.code,
          message: err.message
        }
      );

    } else { 
      // if protected message, code, and statusCode exists, use those values 
      if (err.internal.code && err.internal.message) {
        return res.status(err.internal.statusCode || statusCode).json(
          {
            code: err.internal.code,
            message: err.internal.message,
          }
        );
      }
    }
  }

  console.error('Unknown Error')
  return res.status(500).json('Unknown error');
}

