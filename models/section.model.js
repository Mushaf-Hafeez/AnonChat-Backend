const mogoose = require("mogoose");

const sectionSchema = new mongoose.Schema(
  {
    department: {
      name: mogoose.Schema.Types.ObjectId,
      ref: "Department",
    },
    semester: {
      name: Number,
      required: true,
    },
    sections: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Section", sectionSchema);
