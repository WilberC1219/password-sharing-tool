const express = require("express");

const app = express();
const port = 3000;

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
    res.json({ message: "done", status: 200 });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "internal_server_error" });
  }
});
