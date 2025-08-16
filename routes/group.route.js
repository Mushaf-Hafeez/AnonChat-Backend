const express = require("express");
const groupRoutes = express.Router();

// import middleware functions
const { isAuth, isGroupAdmin } = require("../middlewares/auth.middleware");

// import controller functions
const {
  createGroup,
  updateGroup,
  deleteGroup,
  addMember,
  removeMember,
} = require("../controllers/group.controller");

groupRoutes.post("/create", isAuth, isGroupAdmin, createGroup);
groupRoutes.put("/update/:id", isAuth, isGroupAdmin, updateGroup);
groupRoutes.delete("/delete/:id", isAuth, isGroupAdmin, deleteGroup);
groupRoutes.put("/add/:id", isAuth, isGroupAdmin, addMember);
groupRoutes.delete("/remove/:id", isAuth, isGroupAdmin, removeMember);

module.exports = groupRoutes;
