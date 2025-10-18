const express = require("express");
const messageRoutes = express.Router();

const { isAuth, isGroupAdmin } = require("../middlewares/auth.middleware");

const {
  getMessages,
  sendMessage,
  deleteMessage,
  reportMessage,
  dismissReportedMessage,
} = require("../controllers/message.controller");

messageRoutes.get("/messages/:id", isAuth, getMessages);
messageRoutes.post("/send/:id", isAuth, sendMessage);
messageRoutes.delete("/delete/:groupId/:messageId", isAuth, deleteMessage);
messageRoutes.put("/report/:groupId/:messageId", isAuth, reportMessage);
messageRoutes.put(
  "/dsimiss/:groupId/:messageId",
  isAuth,
  isGroupAdmin,
  dismissReportedMessage
);

module.exports = messageRoutes;
