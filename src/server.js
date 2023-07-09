require("dotenv").config();
const express = require("express");
const app = express();
const db = require("./models/models_config");
const { User, Password } = db;
const { getErrorResponse } = require("./errors/error_handler");
const port = process.env.PORT || 3000;
const { verify, verifyJwt } = require("./utils/genjwt");
const { UnauthorizedError } = require("./errors/errors");
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
    //verify the token is valid
    const decodedToken = await verifyJwt(req.body.token);

    // retrieve data for password payload
    const owner_id = decodedToken.id;
    const { url, login, password, label, key } = req.body;

    // store password
    const result = await Password.createPassword({ owner_id, url, login, password, label, key });
    console.log(result);

    res.status(200).json({ message: `Password was successfully saved!` });
  } catch (error) {
    console.error(error);

    const { statusCode, errorMessage, errorDetails } = getErrorResponse(error, "saving password failed.");
    res.status(statusCode).json({ errorMessage, errorDetails });
  }
});
