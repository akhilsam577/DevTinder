const express = require("express");
const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const userRouter = express.Router();

const USER_SAFE_DATA = "firstName lastName age skills gender photoUrl";

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const currentUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      toUserId: currentUser._id,
      status: "interested",
    }).populate("fromUserId", ["firstname", "lastname", "age", "skills"]);
    if (!connectionRequests) {
      return res.status(404).send("no requests found");
    }
    res.json({
      message: " data fetched successfully",
      data: connectionRequests,
    });
  } catch (err) {
    res.status(400).send("Error:" + err.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const currentUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { toUserId: currentUser._id, status: "accepted" },
        {
          fromUserId: currentUser._id,
          status: "accepted",
        },
      ],
    }).populate("fromUserId", USER_SAFE_DATA);
    if (!connectionRequests) {
      return res.status(404).send("no requests found");
    }

    const data = connectionRequests.map((row) => {
      if (row.fromUserId._id.toString() === currentUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    res.json({
      message: " data fetched successfully",
      data,
    });
  } catch (err) {
    res.status(400).send("Error:" + err.message);
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const currentUser = req.user;

    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: currentUser._id }, { toUserId: currentUser._id }],
    }).select("fromUserId toUserId");

    if (!connectionRequests) {
      return res.status(404).send("no requests found");
    }
    const hideUserFromFeed = new Set();
    connectionRequests.forEach((req) => {
      hideUserFromFeed.add(req.fromUserId.toString());
      hideUserFromFeed.add(req.toUserId.toString());
    });
    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUserFromFeed) } }, //not in {query operator}
        { _id: { $ne: currentUser._id } }, //not equal to {query operator}
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);

    res.json({
      message: " data fetched successfully",
      data: users,
    });
  } catch (err) {
    res.status(400).send("Error:" + err.message);
  }
});

module.exports = userRouter;
