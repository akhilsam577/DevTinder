const express = require("express");
const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const requestRouter = express.Router();

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const allowedStatus = ["ignored", "interested"];
      console.log("coming here");
      if (!allowedStatus.includes(status)) {
        return res.status(404).json({
          message: "invalid status type" + status,
        });
      }

      const toUser = await User.findById(toUserId);
      if (!toUser) {
        res.status(404).send({ message: "User not found" });
      }

      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          {
            fromUserId: toUserId,
            toUserId: fromUserId,
          },
        ],
      });

      if (existingConnectionRequest) {
        return res.status(400).send({
          message: "connection request already exist",
        });
      }

      const connectionRequest = new ConnectionRequest({
        toUserId,
        fromUserId,
        status,
      });
      const data = await connectionRequest.save();
      res.send({
        message: status == "interested" ? "request sent" : "request ignored",
        data,
      });
    } catch (err) {
      res.status(404).send("Error:" + err.message);
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const { status, requestId } = req.params;
      const currentUser = req.user;

      const allowedStatus = ["accepted", "rejected"];

      if (!allowedStatus.includes(status)) {
        res.status(400).send("status code is invalid");
      }

      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: currentUser._id,
        status: "intrested",
      });

      if (!connectionRequest) {
        return res
          .status(404)
          .json({ message: "connection request not found" });
      }

      connectionRequest.status = status;
      const data = await connectionRequest.save();
      res.json({ message: "connection request: " + status, data });
    } catch (err) {
      res.status(404).send("Error:" + err.message);
    }
  }
);

module.exports = requestRouter;
