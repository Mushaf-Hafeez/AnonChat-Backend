const express = require("express");
const groupRoutes = express.Router();

// import middleware functions
const { isAuth, isGroupAdmin } = require("../middlewares/auth.middleware");

// import controller functions
const {
  getGroupDetails,
  createGroup,
  updateGroup,
  deleteGroup,
  addMember,
  removeMember,
  leaveGroup,
  group,
  joinGroupRequest,
  rejectMember,
} = require("../controllers/group.controller");

groupRoutes.get("/", isAuth, group);
groupRoutes.get("/details/:id", isAuth, getGroupDetails);
groupRoutes.post("/create", isAuth, isGroupAdmin, createGroup);
groupRoutes.put("/update/:id", isAuth, isGroupAdmin, updateGroup);
groupRoutes.delete("/delete/:id", isAuth, isGroupAdmin, deleteGroup);
groupRoutes.put("/add/:groupId/:userId", isAuth, isGroupAdmin, addMember);
groupRoutes.put("/reject/:groupId/:userId", isAuth, isGroupAdmin, rejectMember);
groupRoutes.delete("/remove/:id", isAuth, isGroupAdmin, removeMember);
groupRoutes.post("/join/:id", isAuth, joinGroupRequest);
groupRoutes.delete("/leave/:id", isAuth, leaveGroup);

module.exports = groupRoutes;
