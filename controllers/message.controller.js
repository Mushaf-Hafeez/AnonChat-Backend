const { response } = require("express");
const Message = require("../models/message.model");
const User = require("../models/user.model");

// importing helper function
const { uploadFile } = require("../utils/util");

// sendMessage controller function
exports.sendMessage = async (req, res) => {
  // get the groupID from the req.param
  const group = req.params.id;

  // get the userID from the req
  const sender = req.user.id;

  //   get the data from the req
  const content = req.body?.message;

  const files = req?.files?.files;

  try {
    // validation

    if (
      (!content || content.trim() === "") &&
      (!files || (Array.isArray(files) && files.length === 0))
    ) {
      return res.status(400).json({
        success: false,
        message: "Cannot send empty message",
      });
    }

    // array to store the links of the uploaded media
    const secureURLs = [];

    if (Array.isArray(files)) {
      for (const file of files) {
        const response = await uploadFile(file);

        secureURLs.push(response);
      }
    } else {
      const response = await uploadFile(files);

      secureURLs.push(response);
    }

    // store the message into the database
    await Message.create({
      sender,
      group,
      content,
      attachment: secureURLs,
    });

    // return the success response
    return res.status(200).json({
      success: true,
      message: "Message send",
    });
  } catch (error) {
    console.log(
      "Error in the send message controller function: ",
      error.message
    );
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
