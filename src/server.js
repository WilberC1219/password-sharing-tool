const dotenv = require("dotenv");
const app = express();
const db = require("./models/models_config");
const express = require("express");
const { User } = db;
const { getErrorResponse } = require("./utils/error_utils");
const { jwt } = require("jsonwebtoken");
dotenv.config();
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

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.post("/signup", async (req, res) => {
  try {
    await User.createUser(req.body);
    res.status(200).json({ message: `Sign up was successful!` });
  } catch (error) {
    console.error(error);

    const { statusCode, errorMessage, cause } = getErrorResponse(error);
    res.status(statusCode).json({ errorMessage, cause });
  }
});
