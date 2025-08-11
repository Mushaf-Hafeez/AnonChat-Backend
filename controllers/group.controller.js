const Group = require("../models/group.model");
const User = require("../models/user.model");

// create group controller function
exports.createGroup = async (req, res) => {
  // get the data from the req
  const { groupName, description, section, semester } = req.body;

  try {
    // validation
    if (!groupName || !section || !semester) {
      return res.status(400).json({
        success: false,
        message: "All the fields are required",
      });
    }

    // return if the semeter and section of the admin are not same because admin cannot create a group for another section or semester

    if (req.user.section !== section || req.user.semester !== semester) {
      return res.status(400).json({
        success: false,
        message:
          "You are not authorized to create group for another section/semester",
      });
    }

    // return if the group already exists with the same name, semester and section
    const doesExist = await Group.findOne({ groupName, section, semester });

    if (doesExist) {
      return res.status(400).json({
        success: false,
        message: "Group already exists",
      });
    }

    // create a group and add the id in the admin's document
    const group = await Group.create({
      groupName,
      description,
      section,
      semester,
      createdBy: req.user.id,
    });

    await User.updateMany(
      { section, semester, role: { $ne: "STUDENT" } },
      {
        $push: { myGroups: group._id },
      }
    );

    await User.updateMany(
      { section, semester },
      { $push: { joinedGroups: group._id } }
    );

    // return the success response
    return res.status(200).json({
      success: true,
      group,
      message: "Group has been created",
    });
  } catch (error) {
    console.log(
      "Error in the create group controller function: ",
      error.message
    );
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// update group controller function
exports.updateGroup = async (req, res) => {
  // get the group ID from the req params
  const { id } = req.params;

  // get the groupName and description from the req body
  const { groupName, description } = req.body;

  try {
    // validation
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Group ID is required",
      });
    }

    // return if no information is provided to be updated
    if (!groupName && !description) {
      return res.status(400).json({
        success: false,
        message: "Please provide the information",
      });
    }

    // return if no group found with this ID in the database
    const doesExist = await Group.findById(id);

    if (!doesExist) {
      return res.status(404).json({
        success: false,
        message: "No group found",
      });
    }

    // reutrn if the user is not the admin of the group
    if (req.user.id != doesExist.createdBy) {
      return res.status(401).json({
        success: false,
        message: "You are not authorized",
      });
    }

    // update the document
    const updatedDOC = await Group.findByIdAndUpdate(
      id,
      {
        groupName,
        description,
      },
      { new: true }
    );

    // return the success response
    return res.status(200).json({
      success: true,
      group: updatedDOC,
      message: "Group has been updated",
    });
  } catch (error) {
    console.log(
      "Error in the update group controller function: ",
      error.message
    );
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// delete group controller function
exports.deleteGroup = async (req, res) => {
  // get the group id from the params
  const { id } = req.params;

  try {
    // validation
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Group ID is required",
      });
    }

    // return if the group doesnot exists in the database
    const doesExist = await Group.findById(id);

    if (!doesExist) {
      return res.status(404).json({
        success: false,
        message: "No group found",
      });
    }

    // check if the user is the admin of the group
    const user = await User.findById(req.user.id);

    const isAuthorized = user.myGroups.find((group) => group == id);

    if (isAuthorized === -1) {
      return res.status(401).json({
        success: false,
        message: "You are not authorized",
      });
    }

    // delete the group
    await doesExist.deleteOne();

    // delete the id from user=> myGroups
    await user.updateMany({ myGroups: id }, { $pull: { myGroups: id } });

    // delete the ID from the each joined member
    await User.updateMany(
      { joinedGroups: id },
      { $pull: { joinedGroups: id } }
    );

    // return the success response
    return res.status(200).json({
      success: true,
      message: "Group has been deleted",
    });
  } catch (error) {
    console.log(
      "Error in the delete group controller function: ",
      error.message
    );
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
