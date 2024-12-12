const express = require("express");
const connectDB = require("./config/database");
const User = require("./modules/user");

const app = express();

app.post("/signup", (req, res) => {
  const userObj = {
    firstName: "Akhil",
    lastName: "Rayila",
    age: "26",
    emailId: "akhil@rayila.com",
  };

  //creating the user model instance
  const user = new User(userObj);

  //always wrap the db connectivity in try / catch
  try {
    user.save();
    res.send("new user added successfully to DataBase");
  } catch (err) {
    console.status(400).err("error sacing the data:", err.message);
  }
});

// app.use("/", (req, resp) => {
//   resp.send("Hello Akhil , welcome");
// });

// always connect to DB before connecting to the sever or listining
connectDB()
  .then(() => {
    app.listen(7777, () => {
      console.log("server is successfully listining to 7777 port");
    });

    console.log("connected to database");
  })
  .catch((err) => {
    console.error("cannot connect to database");
  });
