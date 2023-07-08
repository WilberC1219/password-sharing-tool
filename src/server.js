require("dotenv").config();
const express = require("express");
const app = express();
const db = require("./models/models_config");
const { User } = db;
const { getErrorResponse } = require("./errors/error_handler");
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

    const { statusCode, errorMessage, errorDetails } = getErrorResponse(error, "Sign up failed.");
    res.status(statusCode).json({ errorMessage, errorDetails });
  }
});

app.post("/login", async (req, res) => {
  try {
    const usr = await User.login(req.body);
    res.status(200).json({ message: "Login was successful", payload: usr });
  } catch (error) {
    console.error(error);

    const { statusCode, errorMessage, errorDetails } = getErrorResponse(error, "Login failed.");
    res.status(statusCode).json({ errorMessage, errorDetails });
  }
});

app.post("/save-password", async (req, res) => {
  try {
    console.log(req);
  } catch (error) {
    console.error(error);

    const { statusCode, errorMessage, errorDetails } = getErrorResponse(error, "saving password failed.");
    res.status(statusCode).json({ errorMessage, errorDetails });
  }
});
