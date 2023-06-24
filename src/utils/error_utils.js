const AppError = require("../errors/app_error");
const UnauthorizedError = require("../errors/unauthorized_error");
const NotFoundError = require("../errors/not_found_error");
/**
 * Generates a standardized error response data on the provided error object.
 * @param {Error} error - The error object.
 * @param {message} message - The error message
 * @returns {Object} An object with statusCode, errorMessage, and cause attributes.
 */
function getErrorResponse(error, message) {
  let statusCode = 400; //by default assume this unless otherwise

  // an error defined by sequelize
  if (error.errors && error.errors.length > 0) {
    const errorMap = {};

    error.errors.map((e) => {
      if (e.type.toLowerCase() === "unique violation" && e.path === "id") {
        statusCode = 500;
      }
      errorMap[e.type] = (errorMap[e.type] || []).concat({ field: e.path, validator: e.validatorKey });
    });
    return { statusCode, errorMessage: message, details: errorMap };
  }

  if (error instanceof NotFoundError || error instanceof UnauthorizedError) {
    statusCode = error.code;
  } else if (error.cause === "server") statusCode = 500;

  // anything else is assumed to be an App Error
  return { statusCode, errorMessage: message, details: error.message };
}

module.exports = { getErrorResponse };
