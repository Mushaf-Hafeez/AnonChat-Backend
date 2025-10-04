const express = require("express");
const messageRoutes = express.Router();

const { isAuth } = require("../middlewares/auth.middleware");

const {
  getMessages,
  sendMessage,
  deleteMessage,
} = require("../controllers/message.controller");

messageRoutes.get("/messages/:id", isAuth, getMessages);
messageRoutes.post("/send/:id", isAuth, sendMessage);
messageRoutes.delete("/delete/:id", isAuth, deleteMessage);

module.exports = messageRoutes;
