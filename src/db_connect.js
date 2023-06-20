const user = require("./models/user");

//testing creating user and saving into the database
const User = user();
(async () => {
  try {
    /* Code to create and store a user into the database
    const usr = await User.create({
      firstName: "wilber",
      lastName: "Claudio",
      password: "123abc",
      email: "example2@example2.com",
    });
    console.log(usr);
    */

    /* Code to retrieve user from database (if they exist) */
    const usr = await User.findOne({ where: { email: "seed@seedemail.com" } });
    if (usr === null) {
      console.log("Not found!");
    } else {
      console.log(usr instanceof User); // true
      console.log(usr); // usr instance
    }
  } catch (error) {
    //error.name is the sql error, error.errors[0].message describe cause of error
    console.error(`${error.name}, ${error.errors[0].message}`);
  }
})();
