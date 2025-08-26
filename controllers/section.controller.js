const Department = require("../models/department.model");
const Section = require("../models/section.model");

// create section controller function
exports.createSection = async (req, res) => {
  // get the Department, semester and sections from the req body
  const { department, semester, session, section } = req.body;

  try {
    // validation
    if (!department || !semester || !section || !session) {
      return res.status(400).json({
        success: false,
        message: "All the fields are required",
      });
    }

    // return if no department found with the name
    const doesExist = await Department.findOne({ name: department });

    if (!doesExist) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    // return if section already exists in the database
    const doesSectionExist = await Section.findOne({
      department,
      semester,
      session: session.toUpperCase(),
    });

    // if exists then update it and return the success response
    if (doesSectionExist) {
      const sectionIndex = doesSectionExist.sections.findIndex(
        (item) => item === section
      );

      if (sectionIndex === -1) {
        doesSectionExist.sections.push(section);
        await doesSectionExist.save();

        return res.status(201).json({
          success: true,
          section: doesSectionExist,
          message: "Section added",
        });
      } else {
        return res.status(400).json({
          success: false,
          message: "Already exists",
        });
      }
    }

    // create the section and send the success response
    const createdSection = await Section.create({
      department,
      semester,
      session: session.toUpperCase(),
      sections: section,
    });

    // return the success response
    return res.status(201).json({
      success: true,
      section: createdSection,
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

// get sections controller function
exports.getSections = async (req, res) => {
  // get the dept code and semester from the req body
  const { department, semester, session } = req.query;

  try {
    // validation
    if (!department || !semester || !session) {
      return res.status(400).json({
        success: false,
        message: "Please select Department, Semester and Session",
      });
    }

    // find the sections from the database
    const sections = await Section.find({
      department,
      semester,
      session: session.toUpperCase(),
    });

    if (!sections) {
      return res.status(404).json({
        success: false,
        message: "Sections not found",
      });
    }

    // return success response
    return res.status(200).json({
      success: true,
      sections,
      message: "Sections fetched",
    });
  } catch (error) {
    console.log(
      "Error in the get sections controller function: ",
      error.message
    );
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
