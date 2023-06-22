const { Sequelize, DataTypes } = require("sequelize");
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/config/database.json")[env];
const User = require("./models/user")(new Sequelize(config), DataTypes);
const express = require("express");
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
    const creationResult = await User.createUser(req.body);

    if (creationResult.errors) {
      res.status(400).json({ message: `Sign up failed` });
    } else {
      res.status(200).json({ message: "User sign up successful" });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "internal_server_error" });
  }
});
