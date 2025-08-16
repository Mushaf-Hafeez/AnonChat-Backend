const express = require("express");
const deptRoutes = express.Router();

// import middleware functions
const { isAuth, isAdmin } = require("../middlewares/auth.middleware");

// import controller functions
const {
  createDepartment,
  getDepartments,
} = require("../controllers/department.controller");

deptRoutes.post("/create", isAuth, createDepartment);
deptRoutes.get("/departments", getDepartments);

module.exports = deptRoutes;
