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
