const express = require("express");
const User = require("../modules/user");
const { validateSignUpData } = require("../utils/validation");
const authRouter = express.Router();
const bcrypt = require("bcrypt");

authRouter.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, emailId, password, skills } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    validateSignUpData(req);
    const user = new User({
      firstName,
      lastName,
      emailId,
      skills,
      password: passwordHash,
    });
    user.save();
    res.send("new user added successfully to DataBase");
  } catch (err) {
    res.status(400).send(err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    console.log("email:", emailId);
    console.log("pwd:", password);

    const user = await User.findOne({ emailId: emailId });

    if (!user) {
      return res.status(401).send("Invalid Credentials");
    }

    const isValidUser = user.validatePassword(password);

    if (isValidUser) {
      const token = await user.getJWT();

      res.cookie("token", token);
      res.send("Login successful");
    } else {
      res.status(401).send("Invaliddd credentials");
    }
  } catch (err) {
    console.log("Error:", err);
    res.status(500).send("Something wenttt wrong");
  }
});

authRouter.post("/logout", (req, res) => {
  res
    .cookie("token", null, {
      experies: new Date(Date.now()),
    })
    .send("Logout successful");
});
module.exports = authRouter;
