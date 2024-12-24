const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    console.log("token", token);

    if (!token) {
      return res.status(401);
    }

    const decodedData = await jwt.verify(token, "devTinder@577");
    const { _id } = decodedData;

    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not found");
    }
    req.user = user;
    next();
  } catch (err) {
    console.log(err.messsage);
    res.status(400).send("Errorr:" + err.message);
  }
};
module.exports = { userAuth };
