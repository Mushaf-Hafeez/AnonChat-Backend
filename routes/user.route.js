const express = require("express");
const userRoutes = express.Router();

// import controller functions
const { signup } = require("../controllers/user.controller");

userRoutes.post("/signup", signup);

module.exports = userRoutes;
