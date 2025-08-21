const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxLength: 25,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    rollno: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["STUDENT", "CR", "GR", "SUPER_ADMIN"],
      default: "STUDENT",
    },
    section: {
      type: String,
      default: "1M",
      required: true,
    },
    semester: {
      type: String,
      default: "1st",
      required: true,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordTokenExpiresIn: {
      type: Date,
    },
    myGroups: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group",
      },
    ],
    joinedGroups: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
