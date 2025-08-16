const express = require("express");
const deptRoutes = express.Router();

// import middleware functions
const { isAuth, isAdmin } = require("../middlewares/auth.middleware");

// import controller functions
const { createDepartment } = require("../controllers/department.controller");

deptRoutes.post("/create", isAuth, createDepartment);

module.exports = deptRoutes;
