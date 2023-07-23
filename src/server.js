require("dotenv").config();
const express = require("express");
const app = express();
const db = require("./models/models_config");
const { User, Password } = db;
const { expressjwt } = require("express-jwt");
const { getErrorResponse } = require("./errors/error_handler");
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(
  expressjwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"],
  }).unless({ path: ["/login", "/signup", "/"] })
);

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});

app.post("/session", (req, res) => {
  try {
    // 200 success res
    res.status(200).json({ sessionValid: true });
  } catch (error) {
    console.error(error);

    const { statusCode, errorMessage, errorDetails } = getErrorResponse(error, "Session expired, please log back in");
    res.status(statusCode).json({ errorMessage, errorDetails });
  }
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
    const owner_id = req.auth.id;
    const { url, login, password, label } = req.body;

    const result = await Password.createPassword({ owner_id, url, login, password, label });
    res.status(200).json({ message: `Password was successfully saved!` });
  } catch (error) {
    console.error(error);

    const { statusCode, errorMessage, errorDetails } = getErrorResponse(error, "saving password failed.");
    res.status(statusCode).json({ errorMessage, errorDetails });
  }
});

app.post("/list-saved-passwords", async (req, res) => {
  try {
    const owner_id = req.auth.id;
    const result = await Password.getSavedPasswords(owner_id);

    res.status(200).json({ message: `Successfully retrieved saved passwords!`, data: result });
  } catch (error) {
    console.error(error);

    const { statusCode, errorMessage, errorDetails } = getErrorResponse(error, "saving password failed.");
    res.status(statusCode).json({ errorMessage, errorDetails });
  }
});

app.post("/share-password", async (req, res) => {
  try {
  } catch (error) {}
});
