/**
 * Creates a new instance of NotFoundError. This error is to be used when
 * data cannot be found in the database
 * @param {string} [message] - message is the error details
 */
class NotFoundError extends Error {
  constructor(message = "Not found") {
    super(message);
    this.name = "NotFoundError";
    this.code = 404;
  }
}

module.exports = NotFoundError;
