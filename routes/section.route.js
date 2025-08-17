const express = require("express");
const sectionRoutes = express.Router();

// importing middlewares
const { isAuth, isAdmin } = require("../middlewares/auth.middleware");

// importing controllers
const {
  createSection,
  addSection,
  getSections,
} = require("../controllers/section.controller");

sectionRoutes.post("/create", isAuth, createSection);
sectionRoutes.put("/add/:id", isAuth, addSection);
sectionRoutes.get("/sections", getSections);

module.exports = sectionRoutes;
