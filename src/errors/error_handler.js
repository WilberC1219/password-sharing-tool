/**
 * Generates a standardized error response data on the provided error object.
 * @param {Error} error - The error object.
 * @param {message} message - The error message
 * @returns {Object} An object with statusCode, errorMessage, and cause attributes.
 */
function getErrorResponse(error, message) {
  const statusCode = error.code ? error.code : 400;

  // an error defined by sequelize
  if (error.errors && error.errors.length > 0) {
    const errorMap = {};

    error.errors.map((e) => {
      if (e.type.toLowerCase() === "unique violation" && e.path === "id") {
        statusCode = 500;
      }
      errorMap[e.type] = (errorMap[e.type] || []).concat({ field: e.path, validator: e.validatorKey });
    });
    return { statusCode, errorMessage: message, errorDetails: errorMap };
  }

  // anything other error is an error from the errors directory
  return { statusCode, errorMessage: message, errorDetails: { type: error.name, cause: error.message } };
}

module.exports = { getErrorResponse };
