const express = require("express");
const userRoutes = express.Router();

// import controller functions
const { signup, sendOTP } = require("../controllers/user.controller");

userRoutes.post("/send-otp", sendOTP);
userRoutes.post("/signup", signup);

module.exports = userRoutes;
