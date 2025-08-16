const Department = require("../models/department.model");

// create department controller function
exports.createDepartment = async (req, res) => {
  // get code, name from the req body
  const { code, name } = req.body;

  try {
    // validation
    if (!code || !name) {
      return res.status(400).json({
        success: false,
        message: "All the fields are required",
      });
    }

    // return if another department exists with this code
    const doesExist = await Department.findOne({ code });

    if (doesExist) {
      return res.status(400).json({
        success: false,
        message: "Department already exist",
      });
    }

    // create the department
    const department = await Department.create({ code, name });

    // return the success response
    return res.status(201).json({
      success: true,
      department,
      message: "Department created",
    });
  } catch (error) {
    console.log(
      "Error in the create department controller function: ",
      error.message
    );
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
