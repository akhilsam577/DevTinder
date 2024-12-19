const express = require("express");
const connectDB = require("./config/database");
const User = require("./modules/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middleware/auth");
const app = express();
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const { profileRouter } = require("./routes/profile");

app.use("/", authRouter);
app.use("/", profileRouter);

// app.post("/signup", async (req, res) => {
//   try {
//     const { firstName, lastName, emailId, password, skills } = req.body;
//     const passwordHash = await bcrypt.hash(password, 10);
//     validateSignUpData(req);
//     const user = new User({
//       firstName,
//       lastName,
//       emailId,
//       skills,
//       password: passwordHash,
//     });
//     user.save();
//     res.send("new user added successfully to DataBase");
//   } catch (err) {
//     res.status(400).send(err.message);
//   }
// });

// app.post("/login", async (req, res) => {
//   try {
//     const { emailId, password } = req.body;
//     console.log("email:", emailId);
//     console.log("pwd:", password);

//     const user = await User.findOne({ emailId: emailId });

//     if (!user) {
//       return res.status(401).send("Invalid Credentials");
//     }

//     const isValidUser = user.validatePassword(password);

//     if (isValidUser) {
//       const token = await user.getJWT();

//       res.cookie("token", token);
//       res.send("Login successful");
//     } else {
//       res.status(401).send("Invaliddd credentials");
//     }
//   } catch (err) {
//     console.log("Error:", err);
//     res.status(500).send("Something wenttt wrong");
//   }
// });

app.get("/feed", async (req, res) => {
  const usersData = await User.find({});

  try {
    res.send(usersData);
  } catch (err) {
    res.status(404).send("something wnet wrong!");
  }
});
// here userAuth is the middleware we used for authintication and coded in middlewares
// app.get("/profile", userAuth, async (req, res) => {
//   //   const cookies = req.cookies;
//   //   const { token } = cookies;
//   //   const decodedToken = jwt.verify(token, "devTinder@577");
//   //   console.log("decodedToken", decodedToken);
//   //   console.log("Token", token);
//   res.send("reading cookies");
// });

app.get("/user", userAuth, async (req, res) => {
  //   const userEmailId = req.body.emailId;
  try {
    // const userData = await User.find({ emailId: userEmailId });
    const userData = req.user;
    res.send(userData);
  } catch (err) {
    res.status(404).send("something went wronmg!");
  }
});

app.delete("/user", async (req, res) => {
  const userId = req.body.userID;
  try {
    const user = await User.findByIdAndDelete(userId);
    res.send("user deleted successfully");
  } catch (err) {
    res.status(404).send("something went wrong");
  }
});

app.patch("/user/:userId", async (req, res) => {
  const userId = req.params.userId;
  const data = req.body;

  try {
    const ALLOWED_UPDATES = ["skills", "age", "gender", "photoUrl"];
    const isUpdatesAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );

    if (!isUpdatesAllowed) {
      throw new Error("These fields are not allowed to update");
    }
    if (data?.skills?.length > 10) {
      throw new Error("Skills cannot be more than 10");
    }
    await User.findByIdAndUpdate({ _id: userId }, data, {
      returnDocument: "before",
      runValidators: true,
    });
    res.send("user updated successfully");
  } catch (err) {
    console.log("errorrrr", err);
    res.status(404).send(err.message);
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
