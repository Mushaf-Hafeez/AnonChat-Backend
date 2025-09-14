const express = require("express");
const messageRoutes = express.Router();

const { isAuth } = require("../middlewares/auth.middleware");

const { sendMessage } = require("../controllers/message.controller");

messageRoutes.post("/send/:id", isAuth, sendMessage);

module.exports = messageRoutes;
