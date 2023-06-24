const express = require("express");
const app = express();
const port = 3000;
const db = require("./models/models_config");
const { User } = db;
const { getErrorResponse } = require("./utils/error_utils");

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
    console.log(creationResult);
    res.status(200).json({ message: "Sign up was successful" });
  } catch (error) {
    console.error(error);

    const { statusCode, errorMessage, cause } = getErrorResponse(error);
    res.status(statusCode).json({ errorMessage, cause });
  }
});
