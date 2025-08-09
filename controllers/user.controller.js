// models
const User = require("../models/user.model");
const OTP = require("../models/otp.model");

// packages
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const otpGenerator = require("otp-generator");
const {
  sendMailToUser,
  generateCookie,
  isValidEmail,
} = require("../utils/util");

// helper functions
const {
  generateAnonChatOTPEmail,
  generateAnonChatWelcomeEmail,
  generateAnonChatResetPasswordEmail,
} = require("../templates/mail.template");
const { sendMail } = require("../config/nodemailer.config");

require("dotenv").config();

// OTP controller function
exports.sendOTP = async (req, res) => {
  // get the user email
  const { email } = req.body;

  try {
    // validate the user email
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email not found",
      });
    }

    // return if the email is not valid

    // =========================================================================================
    // uncomment this code after testing
    // =========================================================================================

    // if (!isValidEmail(email)) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Please use university email",
    //   });
    // }

    // return if the user already exists with this mail
    const doesExist = await User.findOne({ email });

    if (doesExist) {
      return res.status(400).json({
        success: false,
        message: "User already regitered",
      });
    }

    // generate the 6 digit opt only contains the numbers
    const otp = otpGenerator.generate(6, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    // send the otp to the user mail using nodemailer
    sendMailToUser(email, "Email Verification", generateAnonChatOTPEmail(otp));

    // create otp in the database
    await OTP.create({
      email,
      otp,
      expiresIn: Date.now() + 5 * 60 * 1000,
    });

    // return the success response
    return res.status(200).json({
      success: true,
      message: "OTP send successfully",
    });
  } catch (error) {
    console.log("Error in the otp controller function: ", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// singup controller function
exports.signup = async (req, res) => {
  // get the user data from req
  const {
    name,
    email,
    rollno,
    password,
    confirmPassword,
    role,
    section,
    semester,
    otp,
  } = req.body;

  try {
    // validation
    if (
      !name ||
      !email ||
      !rollno ||
      !password ||
      !confirmPassword ||
      !role ||
      !section ||
      !semester
    ) {
      return res.status(400).json({
        success: false,
        message: "All the fields are required",
      });
    }

    // return if the email is not valid

    // =========================================================================================
    // uncomment this code after testing
    // =========================================================================================

    // if (!isValidEmail(email)) {
    //   return res.status(400).json({
    //     success: false,
    //     messag: "Please use university email",
    //   });
    // }

    // return if the user already exits in the database
    const doesExist = await User.findOne({ email });

    if (doesExist) {
      return res.status(400).json({
        success: false,
        messag: "User already registered",
      });
    }

    // verify the otp
    const isVerified = await OTP.findOne({
      email,
      otp,
      expiresIn: { $gt: Date.now() },
    });

    if (!isVerified) {
      return res.status(400).json({
        success: false,
        message: "OTP invalid/expired",
      });
    }

    // return if both passwords are not same
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords must be same",
      });
    }

    // hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    if (!hashedPassword) {
      return res.status(500).json({
        success: false,
        message: "Error while hashing the password",
      });
    }

    // create the user account in the database
    const user = await User.create({
      name,
      email,
      rollno,
      password: hashedPassword,
      role,
      section,
      semester,
    });

    // delete all the OTPs with this email
    await OTP.deleteMany({ email });

    const payload = {
      id: user._id,
      email: user.email,
      role: user.role,
    };

    // generate token and cookie
    const token = jwt.sign(payload, process.env.JWT_SECRET);

    // return the res if error while creating a token
    if (!token) {
      return res.status(500).json({
        success: false,
        messag: "Error while creating a token",
      });
    }

    // generate a cookie with this token
    generateCookie(res, token);

    // send the congratulation mail to the user
    sendMailToUser(
      email,
      "Congratualtion on account creation",
      generateAnonChatWelcomeEmail(name)
    );

    // return success response
    return res.status(201).json({
      success: true,
      message: "Account created",
    });
  } catch (error) {
    console.log("Error in the signup controller fucntion: ", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// login controller function
exports.login = async (req, res) => {
  // get the email and password from the req body
  const { email, password } = req.body;

  try {
    // validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        messag: "Please provide all the details",
      });
    }

    // return if the email is not valid

    // =========================================================================================
    // uncomment this code after testing
    // =========================================================================================

    // if (!isValidEmail(email)) {
    //   return res.status(400).json({
    //     success: false,
    //     messag: "Please use university email",
    //   });
    // }

    // return if the user does not exists in the database
    const doesExist = await User.findOne({ email }).lean();

    if (!doesExist) {
      return res.status(404).json({
        success: false,
        messag: "Signup before logging in",
      });
    }

    // return if the password is not correct
    if (!(await bcrypt.compare(password, doesExist.password))) {
      return res.status(400).json({
        success: false,
        messag: "Invalid credentials",
      });
    }

    delete doesExist.password;

    const payload = {
      id: doesExist._id,
      email: doesExist.email,
      role: doesExist.role,
    };

    // generate a token
    const token = jwt.sign(payload, process.env.JWT_SECRET);

    // generate a cookie
    generateCookie(res, token);

    // return with success response
    return res.status(200).json({
      success: true,
      message: "User logged in",
    });
  } catch (error) {
    console.log("Error in the login controller function: ", error.message);
    return res.status(500).json({
      success: false,
      messag: "Internal server error",
    });
  }
};

// fotgot password controller function
exports.forgotPassword = async (req, res) => {
  // get the email from the req body
  const { email } = req.body;

  try {
    // validate the email
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email not found",
      });
    }

    // return if the email is not valid

    // =========================================================================================
    // uncomment this code after testing
    // =========================================================================================

    // if (!isValidEmail(email)) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Invalid email",
    //   });
    // }

    // return if the user does not exists in the database
    const doesExist = await User.findOne({ email });

    if (!doesExist) {
      return res.status(404).json({
        success: false,
        message: "User does not exists with this email",
      });
    }

    // generate a link to reset the password
    const resetPasswordToken = crypto.randomUUID();
    const resetPasswordLink =
      process.env.FRONTEND_URL + "/" + resetPasswordToken;

    // store the link and the expiration time in the database
    doesExist.resetPasswordToken = resetPasswordToken;
    doesExist.resetPasswordTokenExpiresIn = Date.now() + 5 * 60 * 1000;

    await doesExist.save();

    // send the link to the user's email
    sendMailToUser(
      email,
      "Reset Password",
      generateAnonChatResetPasswordEmail(resetPasswordLink)
    );

    // return the success response
    return res.status(200).json({
      success: true,
      message: "Reset password link send to the email",
    });
  } catch (error) {
    console.log(
      "Error in the forgot password controller function: ",
      error.message
    );
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// reset password controller function
exports.resetPassword = async (req, res) => {
  // get the token from the req params
  const { resetPasswordToken } = req.params;

  // get the password from the req body
  const { password, confirmPassword } = req.body;
  try {
    // validation
    if (!resetPasswordToken || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All the fields are required",
      });
    }

    // return if no user found in the database
    const doesExist = await User.findOne({
      resetPasswordToken,
      resetPasswordTokenExpiresIn: { $gt: Date.now() },
    });

    if (!doesExist) {
      return res.status(400).json({
        success: false,
        message: "Token invalid/expired",
      });
    }

    // return if the passwords are not same
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords must be same",
      });
    }

    // hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // update the user document
    doesExist.password = hashedPassword;
    doesExist.resetPasswordToken = null;
    doesExist.resetPasswordTokenExpiresIn = null;

    await doesExist.save();

    // return the success response
    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.log(
      "Error in the reset password controller function: ",
      error.message
    );
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// logout controller function
exports.logout = async (req, res) => {
  try {
    // clear the cookie
    return res.clearCookie("token").status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.log("Error in the logout controller function: ", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
