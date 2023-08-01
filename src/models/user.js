"use strict";
const { Model } = require("sequelize");
const { ValidationError, UnauthorizedError, NotFoundError, InternalError } = require("../errors/errors");
const { uuidWithPrefix } = require("../utils/uuid");
const { compare } = require("bcryptjs");
const { hashStr } = require("../utils/hash");
const { genJwt } = require("../utils/genjwt");

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
      key: {
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
   * @throws {ValidationError} If theres an issue with input not meeting a requirement
   * @throws {InternalError} If an unexpected error occurs during the hashing process.
   */
  User.beforeCreate(async (user) => {
    if (user.password.length > 16 || user.password.length < 8) {
      throw new ValidationError("Password does not meet length requirement. Password must be 8 to 16 characters!");
    }
    if (user.key.length > 10 || user.key.length < 5) {
      throw new ValidationError("Key does not meet length requirement. Key must be 6 to 10 characters");
    }

    try {
      user.id = uuidWithPrefix(true, "usr");
      user.password = await hashStr(user.password);
      user.key = await hashStr(user.key);
    } catch (error) {
      throw new InternalError();
    }
  });

  /**
   * Creates and stores a user into the database.
   * @param {Object} payload - The user object containing the user's data.
   * @returns {User} - A Promise that resolves with the created user
   * instance if successful, or Error if an error occurs.
   * @throws {Error} If an unexpected error occurs during the create process.
   */
  User.createUser = async (payload) => {
    try {
      // transaction is managed by sequelize. t.commit() and t.rollback() are automatic
      const trnResult = await sequelize.transaction(async (t) => {
        const usr = await User.create(payload, { transaction: t });
        return usr;
      });

      return trnResult;
    } catch (error) {
      throw error;
    }
  };

  /**
   * Authenticates a user by their email and password.
   * @param {Object} payload - The user login payload containing email and password.
   * @returns {Object} An object containing the authenticated user's first name, email, and a json web token.
   * @throws {NotFoundError} If no user is found with the provided email.
   * @throws {UnauthorizedError} If an invalid password is entered.
   * @throws {Error} If an unexpected error occurs during the login process.
   */
  User.login = async (payload) => {
    try {
      let { email, password } = payload;
      if (!email || !password) throw new ValidationError("login info cannot be null");

      email = email.toLowerCase();
      const usr = await User.findOne({ where: { email } });
      if (!usr) throw new NotFoundError(`No user found with email ${email}`);

      const match = await compare(password, usr.password);
      if (!match) throw new UnauthorizedError(`Invalid password entered`);

      const { id, firstName } = usr;
      const jwt = await genJwt({ id, firstName, email });
      return { user: { firstName, email }, token: jwt }; //might be need to remove the user object, seems useless
    } catch (error) {
      throw error;
    }
  };

  /**
   * Find a user by their email address.
   * @param {string} email - The email address of the user to be found.
   * @throws {ValidationError} If the provided email is null or empty.
   * @throws {NotFoundError} If no user is found with the provided email.
   * @returns {Object} the user object found associated with the email.
   */
  User.findByEmail = async (email) => {
    try {
      if (!email || email.length === 0) throw new ValidationError("email info cannot be null or empty");

      email = email.toLowerCase();
      const usr = await User.findOne({ where: { email } });
      if (!usr) throw new NotFoundError(`No user found with email ${email}`);
      return usr;
    } catch (error) {
      throw error;
    }
  };

  /**
   * Find a User by its id.
   * @param {string} id - The id of the User to be found.
   * @throws {ValidationError} If the provided id is null or empty.
   * @throws {NotFoundError} If no User is found with the provided id.
   * @returns {Object} the User object associated with the id.
   */
  User.findById = async (id) => {
    try {
      if (!id || id.length === 0) {
        throw new ValidationError("user id cannot be null or empty");
      }

      const usr = await User.findOne({ where: { id } });
      if (!usr) throw new NotFoundError(`No user found with id ${id}`);
      return usr;
    } catch (error) {
      throw error;
    }
  };
  return User;
};
