function getErrorResponse(error) {
  if (error.name === "SequelizeBaseError") {
    return { statusCode: 400, errorMessage: "Sign up failed", cause: error.message };
  } else if (error.errors && error.errors.length > 0) {
    // iterate through all the errors detected
    let statuscode = 400;
    const errorMap = {};
    error.errors.map((e) => {
      if (e.type.toLowerCase() === "unique violation" && e.path === "id") {
        statuscode = 500;
      }
      errorMap[e.type] = (errorMap[e.type] || []).concat({ field: e.path, validator: e.validatorKey });
    });
    return { statusCode: statuscode, errorMessage: "Sign up failed", cause: errorMap };
  }
  return { statusCode: 500, errorMessage: "Sign up failed", cause: "Internal server error" };
}

module.exports = { getErrorResponse };
