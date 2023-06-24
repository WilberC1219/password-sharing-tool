"use strict";
const { Error, Model } = require("sequelize");
const { uuidWithPrefix } = require("../utils/uuid");
const { hash, genSalt } = require("bcryptjs");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {}
  User.init(
    {
      // Model attributes are defined here
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        validate: {
          notEmpty: true,
        },
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        set(value) {
          this.setDataValue("firstName", value ? value.trim().toLowerCase() : value);
        },
        validate: {
          notEmpty: true,
          isLowercase: true,
        },
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        set(value) {
          this.setDataValue("lastName", value ? value.trim().toLowerCase() : value);
        },
        validate: {
          notEmpty: true,
          isLowercase: true,
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        set(value) {
          this.setDataValue("email", value ? value.trim().toLowerCase() : value);
        },
        validate: {
          notEmpty: true,
          isEmail: true,
          isLowercase: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
    },
    {
      // Other model options go here
      sequelize, // We need to pass the connection instance
      modelName: "User", // We need to choose the model name
    }
  );

  /**
   * Hashes the user's password if it meets length requirements
   * and assigns the user a UUID before storing it into the database.
   * @param {User} user - The user instance being created.
   * @returns {Promise<void>} - A Promise that resolves when the password has been hashed
   * and and UUID is assigned to the user object.
   */
  User.beforeCreate(async (user) => {
    if (user.password.length > 16 || user.password.length < 8) {
      throw new Error("Password does not meet length requirement. Password must be 8 to 16 characters!");
    }

    user.id = uuidWithPrefix(true, "usr");
    try {
      user.password = await hashStr(user.password);
    } catch (error) {
      throw new Error("Hashing error");
    }
  });

  /**
   * Creates and stores a user into the database.
   * @param {Object} userObj - The user object containing the user's data.
   * @returns {Promise<User|Error>} - A Promise that resolves with the created user
   * instance if successful, or Error if an error occurs.
   */
  User.createUser = async (userObj) => {
    try {
      // transaction is managed by sequelize. t.commit() and t.rollback() are automatic
      const trnResult = await sequelize.transaction(async (t) => {
        const usr = await User.create(userObj, { transaction: t });
        return usr;
      });

      return trnResult;
    } catch (error) {
      throw error;
    }
  };

  User.login = async () => {
    try {
      // code to log the user in
    } catch (error) {
      console.error(error);
    }
  };

  return User;
};

/**
 * Hashes the provided string.
 * @param {string} str - The string to be hashed.
 * @returns {Promise<string>} - A Promise that resolves with the hashed string.
 */
async function hashStr(str) {
  try {
    const salt = await genSalt(10);
    const strHashed = await hash(str, salt);
    return strHashed;
  } catch (error) {
    throw new Error("Hashing error");
  }
}
