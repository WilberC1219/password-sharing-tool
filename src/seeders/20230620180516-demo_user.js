"use strict";
const { uuidWithPrefix } = require("../utils/uuid");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */

    return queryInterface.bulkInsert("Users", [
      {
        id: uuidWithPrefix(true, "usr"),
        firstName: "Wilber",
        lastName: "Jr",
        email: "seed1@seedemail1.com",
        password: "123abc",
      },
      {
        id: uuidWithPrefix(true, "usr"),
        firstName: "James",
        lastName: "Wilbert",
        email: "seed2@seedemail2.com",
        password: "123abc",
      },
      {
        id: uuidWithPrefix(true, "usr"),
        firstName: "Anthony",
        lastName: "Aleman",
        email: "seed3@seedemail3.com",
        password: "123abc",
      },
      {
        id: uuidWithPrefix(true, "usr"),
        firstName: "Max",
        lastName: "Milo",
        email: "seed4@seedemail4.com",
        password: "123abc",
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete("Users", null, {});
  },
};
