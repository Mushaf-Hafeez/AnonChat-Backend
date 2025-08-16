const mongoose = require("mongoose");

const sectionSchema = new mongoose.Schema(
  {
    department: {
      type: String,
      required: true,
    },
    semester: {
      type: String,
      required: true,
    },
    session: {
      type: String,
      enum: ["SPRING", "FALL"],
      required: true,
    },
    sections: [
      {
        type: String,
        required: true,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Section", sectionSchema);
