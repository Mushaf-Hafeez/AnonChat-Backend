const express = require("express");
const groupRoute = express.Router();

// import middleware functions
const { isAuth, isGroupAdmin } = require("../middlewares/auth.middleware");

// import controller functions
const {
  createGroup,
  updateGroup,
  deleteGroup,
} = require("../controllers/group.controller");

groupRoute.post("/create", isAuth, isGroupAdmin, createGroup);
groupRoute.put("/update/:id", isAuth, isGroupAdmin, updateGroup);
groupRoute.delete("/delete/:id", isAuth, isGroupAdmin, deleteGroup);

module.exports = groupRoute;
