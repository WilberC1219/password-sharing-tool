/**
 * Creates a new instance of UnauthorizedError. This error is to be used for
 *  any errors that occur. When user is lacking authorization for data
 * @param {string} [message] - message is the error details
 */
class UnauthorizedError extends Error {
  constructor(message = "Unauthorized access") {
    super(message);
    this.name = "UnauthorizedError";
    this.code = 401;
  }
}

module.exports = UnauthorizedError;
