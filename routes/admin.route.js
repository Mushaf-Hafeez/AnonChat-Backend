const express = require("express");
const adminRoutes = express.Router();

// import controller functions
const { addAdmin, removeAdmin } = require("../controllers/admin.controller");

adminRoutes.post("/add", addAdmin);
adminRoutes.delete("/remove/:id", removeAdmin);

module.exports = adminRoutes;
