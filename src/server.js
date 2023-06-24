require("dotenv").config();
const express = require("express");
const app = express();
const db = require("./models/models_config");
const { User } = db;
const { getErrorResponse } = require("./utils/error_utils");
const port = process.env.PORT || 3000;

app.use(express.json());
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.post("/signup", async (req, res) => {
  try {
    await User.createUser(req.body);
    res.status(200).json({ message: `Sign up was successful!` });
  } catch (error) {
    console.error(error);

    const { statusCode, errorMessage, details } = getErrorResponse(error, "Sign up failed.");
    res.status(statusCode).json({ errorMessage, details });
  }
});

app.post("/login", async (req, res) => {
  try {
    const usr = await User.login(req.body);
    if (!usr) {
      return res.status(403).json({ message: "Invalid username or password" });
    }

    console.log(usr);
    res.json({ message: "done", payload: usr, status: 200 });
  } catch (error) {
    console.error(error);

    const { statusCode, errorMessage, details } = getErrorResponse(error, "login failed.");
    res.status(statusCode).json({ errorMessage, details });
  }
});
