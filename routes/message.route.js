const express = require("express");
const messageRoutes = express.Router();

const { isAuth } = require("../middlewares/auth.middleware");

const {
  getMessages,
  sendMessage,
} = require("../controllers/message.controller");

messageRoutes.get("/messages/:id", isAuth, getMessages);
messageRoutes.post("/send/:id", isAuth, sendMessage);

module.exports = messageRoutes;
