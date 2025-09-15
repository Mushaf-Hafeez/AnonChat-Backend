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

    if (files && Array.isArray(files)) {
      if (Array.isArray(files)) {
        for (const file of files) {
          const response = await uploadFile(file);

          secureURLs.push(response);
        }
      } else {
        const response = await uploadFile(files);

        secureURLs.push(response);
      }
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

// getMessages controller function
exports.getMessages = async (req, res) => {
  // get the groupID from the req.params
  const groupID = req.params.id;

  try {
    // validation
    if (!groupID) {
      return res.status(400).json({
        success: false,
        message: "Group ID is missing",
      });
    }

    // get all the messages from the database
    const messages = await Message.find({ group: groupID }).populate(
      "sender",
      "-password"
    );

    // return the success response
    return res.status(200).json({
      success: true,
      messages,
      message: "Messages fetched successfully",
    });
  } catch (error) {
    console.log(
      "Error in the get messages controller function: ",
      error.message
    );
    return res.status(500).json({
      success: false,
      message: "Interanl server error",
    });
  }
};
