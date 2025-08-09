const express = require("express");
const userRoutes = express.Router();

// import middleware functions
const { isAuth } = require("../middlewares/auth.middleware");

// import controller functions
const {
  signup,
  sendOTP,
  login,
  forgotPassword,
  resetPassword,
  logout,
} = require("../controllers/user.controller");

userRoutes.post("/send-otp", sendOTP);
userRoutes.post("/signup", signup);
userRoutes.post("/login", login);
userRoutes.post("/forgot-password", forgotPassword);
userRoutes.put("/reset-password/:resetPasswordToken", resetPassword);
userRoutes.post("/logout", isAuth, logout);

module.exports = userRoutes;
