"use strict";
const { Model } = require("sequelize");
const user = require("./user");
const { ValidationError, UnauthorizedError, NotFoundError, InternalError } = require("../errors/errors");
const { uuidWithPrefix } = require("../utils/uuid");
const { compare } = require("bcryptjs");
const { hashStr } = require("../utils/hash");
const { genJwt } = require("../utils/genjwt");
const { encrypt, decrypt } = require("../utils/encryption");

module.exports = (sequelize, DataTypes) => {
  const User = user(sequelize, DataTypes);

  class Password extends Model {}
  Password.init(
    {
      // Model attributes are defined here
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        validate: {
          notEmpty: true,
        },
      },
      owner_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: User,
          key: "id",
        },
        validate: {
          notEmpty: true,
        },
      },
      shared_to_id: {
        type: DataTypes.UUID,
        defaultValue: null,
        references: {
          model: User,
          key: "id",
        },
        validate: {
          notEmpty: true,
        },
      },
      url: {
        type: DataTypes.STRING,
        allowNull: false,
        set(value) {
          this.setDataValue("url", value ? value.trim() : value);
        },
        validate: {
          notEmpty: true,
        },
      },
      login: {
        type: DataTypes.STRING,
        allowNull: false,
        set(value) {
          this.setDataValue("login", value ? value.trim() : value);
        },
        validate: {
          notEmpty: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      label: {
        type: DataTypes.STRING,
        allowNull: false,
        set(value) {
          this.setDataValue("label", value ? value.trim() : value);
        },
        validate: {
          notEmpty: true,
        },
      },
    },
    {
      // Other model options go here
      sequelize, // We need to pass the connection instance
      modelName: "Password", // We need to choose the model name
    }
  );

  //things that must be done before password is saved to database
  Password.beforeCreate(async (password) => {
    if (!password.owner_id || password.owner_id.length === 0) {
      throw new ValidationError("owner_id was not assigned a value!");
    }

    if (password.owner_id === password.shared_to_id) {
      throw new ValidationError("owner_id cannot be equal to shared_to_id!");
    }

    try {
      // ADD ENCRYPT/DECRYPT
      password.id = uuidWithPrefix(true, "pwd");
      // login, password, lable must be encrypted with key.
      /*
      password.login = encrypt(password.login, key);
      password.password = encrypt(password.password, key);
      password.label = encrypt(password.label, key);

      // hash key
      password.key = await hashStr(password.key);
      */
    } catch (error) {
      throw new InternalError();
    }
  });

  /**
   * Creates and stores a password into the database.
   * @param {Object} payload - The password object containing the password data.
   * @returns {Password} - A Promise that resolves with the created password
   * instance if successful, or Error if an error occurs.
   * @throws {Error} If an unexpected error occurs during the create process.
   */
  Password.createPassword = async (payload) => {
    try {
      const trxResult = await sequelize.transaction(async (t) => {
        const pwd = await Password.create(payload, { transaction: t });
        return pwd;
      });

      return trxResult;
    } catch (error) {
      throw error;
    }
  };

  // retrieves all saved password of provided id
  Password.getSavedPasswords = async (ownerId) => {
    try {
      // ADD ENCRYPT/DECRYPT?
      if (!ownerId) throw new ValidationError("owner_id cannot be null or undefined. Log back in and try again.");

      const row_list = await Password.findAll({
        where: {
          owner_id: ownerId,
          shared_to_id: null,
        },
        attributes: {
          exclude: ["owner_id", "shared_to_id", "createdAt", "updatedAt"],
        },
      });

      // will not handle decrypting the data yet, add that later
      const password_list = [];
      row_list.map((row) => {
        password_list.push(row.dataValues);
      });

      return password_list;
    } catch (error) {
      throw error;
    }
  };

  /**
   * Find a password by its id.
   * @param {string} id - The id of the password to be found.
   * @throws {ValidationError} If the provided id is null or empty.
   * @throws {NotFoundError} If no password is found with the provided id.
   * @returns {Object} the password object associated with the id.
   * Note that the returned password object will still have the Url, login,
   * password, and label encrypted.
   */
  Password.findById = async (id) => {
    try {
      // ADD ENCRYPT/DECRYPT
      if (!id || id.length === 0) {
        throw new ValidationError("password id cannot be null or empty");
      }

      const pwd = await Password.findOne({ where: { id } });
      if (!pwd) throw new NotFoundError(`No password found with id ${id}`);
      return pwd;
    } catch (error) {
      throw error;
    }
  };

  Password.sharePassword = async (ownerId, sharedToEmail, id) => {
    try {
      // ADD ENCRYPT/DECRYPT
      if (!sharedToEmail || sharedToEmail.length === 0) {
        throw new ValidationError("shared_to_id was not assigned a value");
      }
      const sharedToUser = await User.findByEmail(sharedToEmail);

      if (!id || id.length === 0) {
        throw new ValidationError("password id was not assigned a value");
      }
      const pwdFound = await Password.findById(id);

      const payload = {
        owner_id: ownerId,
        shared_to_id: sharedToUser.id,
        url: pwdFound.url,
        login: pwdFound.login,
        password: pwdFound.password,
        label: pwdFound.label,
      };

      const sharedPassword = await Password.createPassword(payload);
      return sharedPassword;
    } catch (error) {
      throw error;
    }
  };

  return Password;
};
