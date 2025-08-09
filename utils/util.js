const transporter = require("../config/nodemailer.config");
require("dotenv").config();

// function to send the email
exports.sendMailToUser = (to, subject, html) => {
  transporter.sendMail({
    from: process.env.NODEMAILER_USER,
    to,
    subject,
    html,
  });
};

// function to create the cookie
exports.generateCookie = (res, token) => {
  res.cookie("token", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  return;
};

// function to check if the email is valid or not
exports.isValidEmail = (email) => {
  return email.endsWith("@iub.edu.pk");
};
