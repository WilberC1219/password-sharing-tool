"use strict";
const { DataTypes, Model } = require("sequelize");
const { uuidWithPrefix } = require("../utils/uuid");
const { hash, genSalt } = require("bcryptjs");

module.exports = (sequelize, Datatypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
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

  // hash password before storing it into the database
  User.beforeCreate(async (user) => {
    user.password = await hashStr(user.password);
  });

  return User;
};

//hashes string passed in
async function hashStr(str) {
  const salt = await genSalt(10);
  return hash(str, salt);
}
