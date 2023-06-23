const express = require("express");
const app = express();
const port = 3000;
const db = require("./models/models_config");
const { User } = db;

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
