const transporter = require("../config/nodemailer.config");
require("dotenv").config();

exports.sendMailToUser = (to, subject, html) => {
  transporter.sendMail({
    from: process.env.NODEMAILER_USER,
    to,
    subject,
    html,
  });
};

exports.generateCookie = (res, token) => {
  res.cookie("token", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  return;
};
