const express = require("express");
const adminRoutes = express.Router();

// importing middleware functions
const { isAuth, isSuperAdmin } = require("../middlewares/auth.middleware");

// import controller functions
const {
  adminLogin,
  getAdmins,
  addAdmin,
  removeAdmin,
} = require("../controllers/admin.controller");

adminRoutes.post("/admin-login", adminLogin);
adminRoutes.get("/admins", isAuth, isSuperAdmin, getAdmins);
adminRoutes.post("/add", isAuth, isSuperAdmin, addAdmin);
adminRoutes.delete("/remove/:id", isAuth, isSuperAdmin, removeAdmin);

module.exports = adminRoutes;
