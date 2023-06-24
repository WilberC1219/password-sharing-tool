/**
 * Generates a standardized error response data on the provided error object.
 * @param {Error} error - The error object.
 * @returns {Object} An object with statusCode, errorMessage, and cause properties.
 */
function getErrorResponse(error) {
  if (error.name === "SequelizeBaseError") {
    let statusCode = 400;
    let errorMessage = "Sign up failed";
    let cause = error.message;

    if (error.message === "Hashing error") {
      statusCode = 500;
      cause = "Internal server error";
    }

    return { statusCode, errorMessage, cause };
  } else if (error.errors && error.errors.length > 0) {
    let statusCode = 400;
    const errorMap = {};

    error.errors.map((e) => {
      if (e.type.toLowerCase() === "unique violation" && e.path === "id") {
        statusCode = 500;
      }
      errorMap[e.type] = (errorMap[e.type] || []).concat({ field: e.path, validator: e.validatorKey });
    });
    return { statusCode, errorMessage: "Sign up failed", cause: errorMap };
  }

  return { statusCode: 500, errorMessage: "Sign up failed", cause: "Internal server error" };
}

module.exports = { getErrorResponse };
