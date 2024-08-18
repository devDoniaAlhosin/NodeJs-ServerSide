class AppError extends Error {
  constructor(message, statusCode, statusText) {
    super(message); // Initialize Error with message
    this.statusCode = statusCode;
    this.statusText = statusText;
    this.isOperational = true; // Custom property to identify operational errors

    Error.captureStackTrace(this, this.constructor); // Capture stack trace
  }

  static create(message, statusCode, statusText) {
    return new AppError(message, statusCode, statusText);
  }
}

module.exports = AppError;
