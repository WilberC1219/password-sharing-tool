const { Sequelize, DataTypes } = require("sequelize");
const { uuidWithPrefix } = require("./utils/uuid");
const env = process.env.NODE_ENV || "development";
const express = require("express");
const config = require(__dirname + "/config/database.json")[env];
const User = require("./models/user")(new Sequelize(config), DataTypes);
const app = express();
const port = 3000;

app.use(express.json());

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.post("/signup", async (req, res) => {
  try {
    //example code to sign up a user

    /*const created = await new users(db).createUser(req.body);
    if (!created) {
      return res.status(400).json({ message: "Sign up failed" });
    }
    */
    console.log(req.body);
    // create the user instance, the create object will store it into the database
    const newUser = await User.create(req.body);
    res.json({ message: "User sign up successful", status: 200 });
  } catch (e) {
    console.error(e);

    if (e.errors[0].instance instanceof User) {
      res.status(400).json({ message: "Sign up failed" });
    } else {
      res.status(500).json({ message: "internal_server_error" });
    }
  }
});
