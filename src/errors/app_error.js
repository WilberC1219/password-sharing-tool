/**
 * Creates a new instance of AppError. This error is to be used for
 *  any errors that occur.
 * @param {string} [message="An app error occurred", cause = "client"]
 * message is the error details, cause is who caused the error. (For simplicity cause should
 * only be "client" or "server")
 */
class AppError extends Error {
  constructor(message = "An app error occurred", cause = "client") {
    super(message);

    this.cause = cause;
    this.name = "AppError";
  }
}

module.exports = AppError;
