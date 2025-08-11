const User = require("../models/user.model");

const jwt = require("jsonwebtoken");
require("dotenv").config();

// middleware to check the authentication
exports.isAuth = async (req, res, next) => {
  try {
    // get the token from the cookie
    const token = req.cookies.token;

    // validdate the token
    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Please login",
      });
    }

    // verify the token using jwt
    try {
      const { id, email, role, section, semester } = jwt.verify(
        token,
        process.env.JWT_SECRET
      );

      // check if that user exits in the database
      const doesExist = await User.findById(id);

      if (!doesExist) {
        return res.status(401).json({
          success: false,
          message: "Invalid token",
        });
      }

      // add the user data id, role and email into the req
      req.user = {
        id,
        email,
        role,
        section,
        semester,
      };

      // send req to the next
      next();
    } catch (error) {
      console.log("Error while verifying the token: ", error.message);
      return res.status(401).json({
        success: false,
        message: "Token expired",
      });
    }
  } catch (error) {
    console.log("Error in the is auth middleware: ", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// middleware to check if the role is CR/GR
exports.isGroupAdmin = (req, res, next) => {
  if (req.user.role !== "CR" && req.user.role !== "GR") {
    return res.status(401).json({
      success: false,
      message: "This is protected route only for the group admins",
    });
  } else {
    console.log("welcome to the CR/GR route");
    next();
  }
};

// middleware to check if the role is ADMIN
exports.isAdmin = (req, res, next) => {
  if (req.user.role !== "ADMIN") {
    return res.status(401).json({
      success: false,
      message: "This is protected route only for the ADMIN",
    });
  } else {
    console.log("welcome to the CR/GR route");
    next();
  }
};
