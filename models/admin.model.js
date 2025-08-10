const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    rollno: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["CR", "GR"],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Admin", adminSchema);
