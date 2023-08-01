const { InternalError, UnauthorizedError } = require("../errors/errors");
const { sign } = require("jsonwebtoken");
const { verify } = require("jsonwebtoken");

/**
 * creates a json web token string with the provided payload.
 * @param {Object} payload - The payload being turned into a json web token string.
 * @returns {string} - A json web token string.
 * @throws {InternalError} If an unexpected error occurs while generating a json web token string
 */
async function genJwt(payload) {
  try {
    const jwt = await sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
    return jwt;
  } catch (error) {
    throw InternalError();
  }
}

module.exports = { genJwt };
