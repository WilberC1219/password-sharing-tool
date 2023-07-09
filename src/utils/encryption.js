const crypto = require("crypto");
const algorithm = "aes-256-ctr";

/**
 * Encrypts a given string using the provided key.
 *
 * @param {string} str - The string to be encrypted.
 * @param {string} key - The encryption key.
 * @returns {string} - The encrypted string in the format "<encrypted>-<initialization vector>".
 */
function encrypt(str, key) {
  const iv = crypto.randomBytes(16);
  const encKey = crypto.createHash("sha256").update(String(key)).digest("base64").slice(0, 32);
  const cipher = crypto.createCipheriv(algorithm, encKey, iv);
  let crypted = cipher.update(str, "utf-8", "base64") + cipher.final("base64");
  return `${crypted}-${iv.toString("base64")}`;
}

/**
 * Decrypts an encrypted string using the provided key.
 *
 * @param {string} encStr - The encrypted string to be decrypted in the format "<encrypted>-<initialization vector>".
 * @param {string} key - The decryption key.
 * @returns {string} - The decrypted string.
 */
function decrypt(encStr, key) {
  const encArr = encStr.split("-");
  const encKey = crypto.createHash("sha256").update(String(key)).digest("base64").slice(0, 32);
  const decipher = crypto.createDecipheriv(algorithm, encKey, Buffer.from(encArr[1], "base64"));
  let decrypted = decipher.update(encArr[0], "base64", "utf-8");
  decrypted += decipher.final("utf-8");
  return decrypted;
}

module.exports = { encrypt, decrypt };
