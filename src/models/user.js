"use strict";
const { Sequelize, DataTypes, Model } = require("sequelize");
const { uuidWithPrefix } = require("../utils/uuid");
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/database.json")[env];

module.exports = (sequelize = new Sequelize(config), datatypes = DataTypes) => {
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
        primaryKey: true,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      // Other model options go here
      sequelize, // We need to pass the connection instance
      modelName: "User", // We need to choose the model name
    }
  );

  //create unique id for user
  User.beforeCreate((user) => {
    user.id = uuidWithPrefix(true, "usr");
  });

  return User;
};
