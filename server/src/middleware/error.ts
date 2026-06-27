import AppError from '../errors/AppError.js'
import type { Request, Response, NextFunction } from 'express';
import { env } from '../config/env.js'

/* Things to add: 
  Production Logger (Look into Winston)
  Request Context / Unique Request ID generation
  Error Monitoring
*/ 

interface ResponseToClient {
  message: string;
  statusCode: number;
  code: string;
}

export function errorHandler (err: Error, _req: Request, res: Response, _next: NextFunction) {
  let response: ResponseToClient;

  // If in development
  if (env.NODE_ENV === "dev" || env.NODE_ENV === "development") {
    
    // Log the error object
    console.error(err);
    console.error(err.stack)

    // If AppError
    if (err instanceof AppError) {
      response = {
        message: err.internal?.message || err.message, 
        statusCode: err.statusCode,
        code: err.code
      }

      return res.status(err.statusCode).json(response);
    } 
    // If standard Error or others
    let statusCode = 500;
    if ('status' in err && typeof err.status === 'number') {
      statusCode = err.status;
    }

    if ('statusCode' in err && typeof err.statusCode === 'number') {
      statusCode = err.statusCode;
    }

    response = {
      message: err.message,
      statusCode: statusCode, 
      code: 'internalError'
    }

    return res.status(statusCode).json(response);
  } 
  
  // If in production
  if (env.NODE_ENV === 'production') { 
    // Return custom error with non internal message
    if (err instanceof AppError) {
      response = {
        message: err.message, 
        statusCode: err.statusCode,
        code: err.code
      }

      return res.status(err.statusCode).json(response);
    } 

    response = {
      message: 'Internal Error.',
      statusCode: 500,
      code: 'internalError'
    }

    // If error is upstream, respond with a vague error
    return res.status(500).json(response);
  }

  response = {
    message: 'Internal Error.',
    statusCode: 500,
    code: 'internalError'
  } 
  return res.status(500).json(response);
}


