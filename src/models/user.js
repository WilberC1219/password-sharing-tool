"use strict";
const { Model } = require("sequelize");
const { uuidWithPrefix } = require("../utils/uuid");
const { hash, genSalt } = require("bcryptjs");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {}
  User.init(
    {
      // Model attributes are defined here
      id: {
        type: DataTypes.UUID,
        defaultValue: uuidWithPrefix(true, "usr"),
        primaryKey: true,
        validate: {
          notEmpty: true,
        },
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        set(value) {
          this.setDataValue("firstName", value.trim().toLowerCase());
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
          this.setDataValue("lastName", value.trim().toLowerCase());
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
          this.setDataValue("email", value.trim().toLowerCase());
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
   * Hashes the user's password before storing it into the database.
   * @param {User} user - The user instance being created.
   * @returns {Promise<void>} - A Promise that resolves when the password has been hashed
   * and assigned to the user object.
   */
  User.beforeCreate(async (user) => {
    user.password = await hashStr(user.password);
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
      //error.name: the seq error|error.errors[0].message: describes cause of error
      console.error(`${error.name}, ${error.errors[0].message}`);
      return error;
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
  const salt = await genSalt(10);
  return hash(str, salt);
}
