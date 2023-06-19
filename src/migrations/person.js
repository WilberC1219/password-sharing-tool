const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize("sqlite::memory:");

const person = sequelize.define(
  "person",
  {
    // Model attributes are defined here
    p_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "People",
  }
);

// `sequelize.define` also returns the model
console.log(User === sequelize.models.User); // true
