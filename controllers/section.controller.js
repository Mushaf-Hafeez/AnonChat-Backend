const Department = require("../models/department.model");
const Section = require("../models/section.model");

// create section controller function
exports.createSection = async (req, res) => {
  // get the Department, semester and sections from the req body
  const { departmentCode, semester, session, sections } = req.body;

  try {
    // validation
    if (
      !departmentCode ||
      !semester ||
      !sections ||
      !session ||
      sections.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "All the fields are required",
      });
    }

    // return if no department found with the name
    const doesExist = await Department.findOne({ code: departmentCode });

    if (!doesExist) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    // create the section
    const section = await Section.create({
      department: departmentCode,
      semester,
      session: session.toUpperCase(),
      sections,
    });

    // return the success response
    return res.status(201).json({
      success: true,
      section,
      message: "Section created",
    });
  } catch (error) {
    console.log(
      "Error in the create section controller function: ",
      error.message
    );
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// add sections controller function
exports.addSection = async (req, res) => {
  // get the section id from the req params
  const { id } = req.params;
  const { sections } = req.body;

  try {
    // validation
    if (!id || !sections) {
      return res.status(400).json({
        success: false,
        message: "All the fields are required",
      });
    }

    // return if no section found with id
    const doesExist = await Section.findById(id);

    if (!doesExist) {
      return res.status(404).json({
        success: false,
        message: "No section found",
      });
    }

    // push the sections into the section
    const section = await Section.findByIdAndUpdate(
      id,
      { $push: { sections } },
      { new: true }
    );

    // return the success response
    return res.status(200).json({
      success: true,
      section,
      message: "Sections added",
    });
  } catch (error) {
    console.log(
      "Error in the add section controller function: ",
      error.message
    );
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
