"use strict";
const { Model, Op } = require("sequelize");
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

  // Define the association to the User model
  Password.belongsTo(User, { foreignKey: "shared_to_id", as: "shared_to_user" });
  Password.belongsTo(User, { foreignKey: "owner_id", as: "shared_by_user" });

  //things that must be done before password is saved to database
  Password.beforeCreate(async (password, options) => {
    try {
      if (!password.owner_id || password.owner_id.length === 0) {
        throw new ValidationError("owner_id was not assigned a value!");
      }

      if (!options.key || options.key.length === 0) {
        throw new ValidationError("key was not assigned a value!");
      }

      if (password.owner_id === password.shared_to_id) {
        throw new ValidationError("owner_id cannot be equal to shared_to_id!");
      }

      const user = await User.findById(password.owner_id);
      const validKey = await compare(options.key, user.key);
      if (!validKey) throw new ValidationError("Invalid key entered");

      password.id = uuidWithPrefix(true, "pwd");
      password.login = encrypt(password.login, options.key);
      password.password = encrypt(password.password, options.key);
    } catch (error) {
      throw error;
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
        const pwd = await Password.create(payload, { transaction: t, key: payload.key });
        return pwd;
      });

      return trxResult;
    } catch (error) {
      throw error;
    }
  };

  // retrieves all saved password of provided id
  Password.getSavedPasswords = async (ownerId, key) => {
    try {
      if (!ownerId) throw new ValidationError("owner_id cannot be null or undefined. Log back in and try again.");

      const saved_list = await Password.findAll({
        where: {
          owner_id: ownerId,
          shared_to_id: null,
        },
        attributes: {
          exclude: ["owner_id", "shared_to_id", "createdAt", "updatedAt"],
        },
      });

      const saved_password_list = saved_list.map((row) => {
        row.dataValues.login = decrypt(row.dataValues.login, key);
        row.dataValues.password = decrypt(row.dataValues.password, key);
        return row;
      });

      return saved_password_list;
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

  Password.sharePassword = async (ownerId, sharedToEmail, id, key) => {
    try {
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

  // design function to geg passwords shared with ownerId and passwords shared shared by ownerId
  Password.getSharedPasswords = async (ownerId, queryOptions) => {
    try {
      // ADD ENCRYPT/DECRYPT?
      if (!ownerId) throw new ValidationError("owner_id cannot be null or undefined. Log back in and try again.");

      const shared_by_owner = await Password.findAll({
        // list of passwords ownerId has shared
        where: {
          owner_id: ownerId,
          shared_to_id: {
            [Op.and]: {
              [Op.not]: null, // shared_to_id is not null
              [Op.ne]: "", // shared_to_id is not empty
            },
          },
        },
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
        include: [
          {
            model: User,
            as: "shared_to_user", // This should match the alias you used in the association
            attributes: ["email"], // Include only the email attribute from the User model
          },
        ],
      });

      const shared_with_owner = await Password.findAll({
        // list of passwords shared with ownerId
        where: {
          shared_to_id: ownerId,
        },
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
        include: [
          {
            model: User,
            as: "shared_by_user", // This should match the alias you used in the association
            attributes: ["email"], // Include only the email attribute from the User model
          },
        ],
      });

      // will not handle decrypting the data yet, add that later
      const by_owner_password_list = shared_by_owner.map((row) => row.dataValues);
      const with_owner_password_list = shared_with_owner.map((row) => row.dataValues);
      return { shared_by_owner: by_owner_password_list, shared_with_owner: with_owner_password_list };
    } catch (error) {
      throw error;
    }
  };

  return Password;
};
