const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://akhilsam577:S6nJXaTtROGImgiK@devtinder.0vc3p.mongodb.net/devTinder"
  );
};

module.exports = connectDB;
