const express = require("express");
const sectionRoutes = express.Router();

// importing middlewares
const { isAuth, isSuperAdmin } = require("../middlewares/auth.middleware");

// importing controllers
const {
  createSection,
  getSections,
} = require("../controllers/section.controller");

sectionRoutes.post("/create", isAuth, isSuperAdmin, createSection);
sectionRoutes.get("/sections", getSections);

module.exports = sectionRoutes;
