const transporter = require("../config/nodemailer.config");
const cloudinary = require("cloudinary").v2;
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

// function to upload the file to cloudinary
exports.uploadFile = async (file) => {
  const response = await cloudinary.uploader.upload(file.tempFilePath, {
    folder: process.env.CLOUDINARY_FOLDER_NAME,
    quality: 60,
    resource_type: "auto",
  });
  return response.secure_url;
};
