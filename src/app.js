const express = require("express");

const app = express();

app.use("/", (req, resp) => {
  resp.send("Hello Akhil , welcome");
});

app.listen(3000, () => {
  console.log("server is successfully listining to 3000 port");
});
