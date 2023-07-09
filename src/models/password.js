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
      modelName: "Password", // We need to choose the model name
    }
  );

  //things that must be done before password is saved to database
  Password.beforeCreate(async (password) => {
    // validate key must be 6-10 characters, ensure that both owner_id and shared_to_Id !=
    if (password.key.length < 6 || password.key.length > 10) {
      throw new ValidationError("key does not meet length requirement. key must be 6 to 10 characters!");
    }

    if (password.owner_id === password.shared_to_id) {
      throw new ValidationError("owner_id cannot be equal to shared_to_id!");
    }

    if (!password.owner_id || password.owner_id.length === 0) {
      throw new ValidationError("owner_id was not assigned a value!");
    }
    password.id = uuidWithPrefix(true, "pwd");
    try {
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

  // store password to the database
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

  return Password;
};
