const usermodel = require("./models/user");

//testing creating user and saving into the database
const User = usermodel();
(async () => {
  try {
    const usr = await User.create({
      firstName: "wilber",
      lastName: "Claudio",
      password: "123abc",
      email: "example2@example2.com",
    });
    console.log(usr);
  } catch (error) {
    console.error(`${error.name}, ${error.errors[0].message}`);
  }
})();
