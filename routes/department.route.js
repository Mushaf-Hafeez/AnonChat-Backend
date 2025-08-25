const express = require("express");
const deptRoutes = express.Router();

// import middleware functions
const { isAuth, isSuperAdmin } = require("../middlewares/auth.middleware");

// import controller functions
const {
  createDepartment,
  getDepartments,
  deleteDepartment,
} = require("../controllers/department.controller");

deptRoutes.post("/create", isAuth, isSuperAdmin, createDepartment);
deptRoutes.delete("/remove/:id", isAuth, isSuperAdmin, deleteDepartment);
deptRoutes.get("/departments", getDepartments);

module.exports = deptRoutes;
