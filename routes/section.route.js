const express = require("express");
const sectionRoutes = express.Router();

// importing middlewares
const { isAuth, isSuperAdmin } = require("../middlewares/auth.middleware");

// importing controllers
const {
  createSection,
  addSection,
  getSections,
} = require("../controllers/section.controller");

sectionRoutes.post("/create", isAuth, isSuperAdmin, createSection);
sectionRoutes.put("/add/:id", isAuth, isSuperAdmin, addSection);
sectionRoutes.get("/sections", getSections);

module.exports = sectionRoutes;
