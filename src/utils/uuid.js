const UUID = require("uuid");

/**
 * Generates a UUID using the v4 version of the UUID algorithm.
 * @param {boolean} [removeDashes=false] - Flag indicating whether to remove dashes from the generated UUID.
 * @returns {string} Generated UUID.
 */
const uuid = (removeDashes = false) => {
  if (removeDashes) {
    return UUID.v4().replace(/-/g, "");
  }

  return UUID.v4();
};

/**
 * Generates a UUID with a prefix using the v4 version of the UUID algorithm.
 * @param {boolean} [removeDashes=false] - Flag indicating whether to remove dashes from the generated UUID.
 * @param {string} prefix - Prefix to add to the generated UUID.
 * @returns {string} Generated UUID with the specified prefix.
 */
const uuidWithPrefix = (removeDashes = false, prefix) => `${prefix}-${uuid(removeDashes)}`;

module.exports = {
  uuid,
  uuidWithPrefix,
};
