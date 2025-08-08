const User = require("../models/user.model");

exports.signup = async (req, res) => {
  try {
  } catch (error) {
    console.log("Error in the signup controller fucntion: ", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
