const express = require("express");
const messageRoutes = express.Router();

const { isAuth } = require("../middlewares/auth.middleware");

const {
  getMessages,
  sendMessage,
  deleteMessage,
  reportMessage,
} = require("../controllers/message.controller");

messageRoutes.get("/messages/:id", isAuth, getMessages);
messageRoutes.post("/send/:id", isAuth, sendMessage);
messageRoutes.delete("/delete/:groupId/:messageId", isAuth, deleteMessage);
messageRoutes.put("/report/:groupId/:messageId", isAuth, reportMessage);

module.exports = messageRoutes;
