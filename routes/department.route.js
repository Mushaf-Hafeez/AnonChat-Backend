const express = require("express");
const deptRoutes = express.Router();

// import middleware functions
const { isAuth, isSuperAdmin } = require("../middlewares/auth.middleware");

// import controller functions
const {
  createDepartment,
  getDepartments,
} = require("../controllers/department.controller");

deptRoutes.post("/create", isAuth, isSuperAdmin, createDepartment);
deptRoutes.get("/departments", getDepartments);

module.exports = deptRoutes;
