export function errorHandler (err, req, res, next) {
  // .status and .statusCode is the convention for custom errors
  const statusCode = err.status || err.statusCode || 500; 
  if (process.env.NODE_ENV === "dev" || process.env.NODE_ENV === "development") {
    console.log("Dev log: ")
    console.error(err);
    return res.status(statusCode).json({message: err.message });
  } else  {
    return res.status(statusCode).json({message: 'Internal Error'})
  }
}

