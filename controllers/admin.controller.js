const Admin = require("../models/admin.model");

// addAdmin controller function
exports.addAdmin = async (req, res) => {
  // get the roll from the req body
  const { rollno, role } = req.body;

  try {
    // validation
    if (!rollno || !role) {
      return res.status(400).json({
        success: false,
        message: "All the fields are required",
      });
    }

    // return if the admin already exists in the database
    const doesExist = await Admin.findOne({ rollno });

    if (doesExist) {
      return res.status(400).json({
        success: false,
        message: "Admin already exists",
      });
    }

    // create admin
    const admin = await Admin.create({ rollno, role });

    // return success response
    return res.status(200).json({
      success: true,
      admin,
      message: "Admin created",
    });
  } catch (error) {
    console.log("Error in the add admin controller function: ", error.message);
    return res.status(500).json({
      success: fasle,
      message: "Internal server error",
    });
  }
};

// removeAdmin controller function
exports.removeAdmin = async (req, res) => {
  // get the id from the req params
  const { id } = req.params;

  try {
    // validation
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID is missing",
      });
    }

    // return if no admin exists in the database
    const doesExist = await Admin.findById(id);

    if (!doesExist) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    // delete the admin
    await Admin.findByIdAndDelete(id);

    // return the success response
    return res.status(200).json({
      success: false,
      message: "Admin removed",
    });
  } catch (error) {
    console.log(
      "Error in the remove admin controller function: ",
      error.message
    );
    return res.status(500).json({
      success: fasle,
      message: "Internal server error",
    });
  }
};
