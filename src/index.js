const express = require("express");

// create server and start listening
const app = express();
const port = 5500;

app.listen(port, () => {
  console.log(`listening on port 5000 ${port}`);
});

app.get("/", (req, res) => {
  res.send("Hello World");
});
