const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema(
  {
    groupName: {
      type: String,
      requird: true,
      trim: true,
      maxLength: 50,
    },
    description: {
      type: String,
      trim: true,
      maxLength: 100,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
    },
    section: {
      type: String,
      required: true,
    },
    semester: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    requests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    reportedMessages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Group", groupSchema);
