import AppError from '../errors/AppError.js'

/* things to add: 
  Production Logger
  Request Context / Unique Request ID generation
  Error Monitoring
*/

export function errorHandler (err, req, res, next) {

  // .status and .statusCode is the convention for custom errors
  const statusCode = err.status || err.statusCode || 500; 

  if (!(err instanceof AppError)) {
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
      if (err.protected.code && err.protected.message) {
        return res.status(err.protected.statusCode || statusCode).json(
          {
            code: err.protected.code,
            message: err.protected.message,
          }
        );
      }
    }

  }
  // otherwise return a vague error 
  return res.status(statusCode).json( 
    {
      code: 'internalError',
      message: 'Internal Error.' 
    }
  );
}

