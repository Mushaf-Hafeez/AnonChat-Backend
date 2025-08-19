const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      requird: true,
    },
    otp: {
      type: String,
      required: true,
    },
    expiresIn: {
      type: Date,
      requird: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("OTP", otpSchema);
