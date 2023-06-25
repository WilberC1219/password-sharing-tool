const { InternalError } = require("../errors/errors");
const { hash, genSalt } = require("bcryptjs");
/**
 * Hashes the provided string.
 * @param {string} str - The string to be hashed.
 * @returns {string} - A hashed string.
 * @throws {InternalError} If an unexpected error occurs during the hashing process.
 */
async function hashStr(str) {
  try {
    const salt = await genSalt(10);
    const strHashed = await hash(str, salt);
    return strHashed;
  } catch (error) {
    throw new InternalError();
  }
}

module.exports = { hashStr };
