export function errorHandler (err, req, res, next) {
  // .status and .statusCode is the convention for custom errors
  const statusCode = err.status || err.statusCode || 500; 

  if (process.env.NODE_ENV === "dev" || process.env.NODE_ENV === "development") {
    // .log and .error writes to different streams which just means they can be configured to go different places for different uses. Also they may differ in formatting
    console.log("Dev log: ")
    console.error(err);
    return res.status(statusCode).json({message: err.message });
  } else {
    if (err.expose === true) {
      return res.status(statusCode).json(
        {
          code: err.code,
          message: err.protectedMessage || err.message
        }
      );
    } else { 
      console.log(err);
      if (err.protectedMessage) {
        return res.status(statusCode).json(
          {
            protectedCode: err.protectedCode,
            protectedMessage: err.protectedMessage,
          }
        );
      }

      return res.status(statusCode).json( 
        {
          code: 'Internal Error.',
          message: 'internalError' 
        }
      );
    }
  }
}

