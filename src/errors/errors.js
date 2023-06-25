/**
 * Creates a new instance of InternalError. This error is to be used when
 * an error occurs due to server side code.
 * @param {string} [message="Internal error"] - message is the error details
 */
class InternalError extends Error {
  constructor(message = "Internal error") {
    super(message);
    this.name = "InternalError";
    this.code = 500;
  }
}

/**
 * Creates a new instance of NotFoundError. This error is to be used when
 * data cannot be found in the database.
 * @param {string} [message="Not found error"] - message is the error details
 */
class NotFoundError extends Error {
  constructor(message = "Not found error") {
    super(message);
    this.name = "NotFoundError";
    this.code = 404;
  }
}

/**
 * Creates a new instance of UnauthorizedError. This error is to be used for
 * any errors that occur when authorization for data is missing.
 * @param {string} [message="Unauthorized error"] - message is the error details
 */
class UnauthorizedError extends Error {
  constructor(message = "Unauthorized error") {
    super(message);
    this.name = "UnauthorizedError";
    this.code = 401;
  }
}

/**
 * Creates a new instance of ValidationError. This error is to be used when
 * data does not meet requirements.
 * @param {string} [message="Validation error"]
 * message is the error details, cause is who caused the error. (For simplicity cause should
 * only be "client" or "server")
 */
class ValidationError extends Error {
  constructor(message = "Validation error") {
    super(message);
    this.name = "ValidationError";
    this.code = 400; // Bad Request
  }
}

module.exports = {
  ValidationError,
  UnauthorizedError,
  NotFoundError,
  InternalError,
};
