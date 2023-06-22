const user = require("./models/user");
const { Sequelize, DataTypes } = require("sequelize");
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/config/database.json")[env];
const User = require("./models/user")(new Sequelize(config), DataTypes);

//testing creating user and saving into the database
(async () => {
  try {
    /* Code to create and store a user into the database */
    const userObj = {
      firstName: "Anthony",
      lastName: "Claudio",
      password: "abcdefgh",
      email: "     AntBeans22@Example.com      ",
    };

    const creationResult = await User.createUser(userObj);
    console.log(creationResult);
    /* Code to retrieve user from database (if they exist) 

    const usr = await User.findOne({ where: { email: "gmailoutlook@example.com" } });
    if (usr === null) {
      console.log("Not found!");
    } else {
      console.log(usr instanceof User); // true
      console.log(usr); // usr instance
    }
    */
  } catch (error) {
    //error.name is the sql error, error.errors[0].message describe cause of error
    console.error(`${error.name}, ${error.errors[0].message}`);
  }
})();
