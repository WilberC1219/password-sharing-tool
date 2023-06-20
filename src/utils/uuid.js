const UUID = require("uuid");

const uuid = (removeDashes = false) => {
  if (removeDashes) {
    return UUID.v4().replace(/-/g, "");
  }

  return UUID.v4();
};

const uuidWithPrefix = (removeDashes = false, prefix) => `${prefix}-${uuid(removeDashes)}`;

module.exports = {
  uuid,
  uuidWithPrefix,
};
