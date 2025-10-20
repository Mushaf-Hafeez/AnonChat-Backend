const Message = require("../models/message.model");
const User = require("../models/user.model");
const Group = require("../models/group.model");

const { io } = require("../config/socket");

// importing helper function
const { uploadFile } = require("../utils/util");
const { resolveHostname } = require("nodemailer/lib/shared");

// sendMessage controller function
exports.sendMessage = async (req, res) => {
  // get the groupID from the req.param
  const group = req.params.id;

  // get the userID from the req
  const sender = req.user.id;

  //   get the data from the req
  const content = req.body?.message;

  const files = req?.files?.attachment;

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

    if (files) {
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
    let message = await Message.create({
      sender,
      group,
      content,
      attachment: secureURLs,
    });

    await message.populate("sender group");

    message = message.toObject();
    delete message.sender.password;

    // send the message to all the groupMember
    io.to(group).emit("new-message", message);

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

// deleteMessage controller function
exports.deleteMessage = async (req, res) => {
  // get the messageId and groupId from the req params
  const { messageId, groupId } = req.params;

  // get the user role from the req.user
  const { id, role } = req.user;

  try {
    // validation
    if (!messageId || !groupId) {
      return res.status(400).json({
        success: false,
        message: "Group ID or Message ID is missing",
      });
    }

    const message = await Message.findById({
      _id: messageId,
    });

    // return if no message found
    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    // if the user is the sender or CR/GR of the group then he can delete the message
    if (message.sender == id || role === "CR" || role === "GR") {
      await Message.findByIdAndDelete({ _id: messageId });

      // delete the message using sockets in realtime
      io.to(groupId).emit("delete-message", {
        messageId,
        groupId,
      });

      // return the success response
      return res.status(200).json({
        success: true,
        message: "Message has been deleted successfully",
      });
    }

    res.end();
  } catch (error) {
    console.log(
      "Error in the delete message controller function: ",
      error.message
    );
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// reportMessage controller function
exports.reportMessage = async (req, res) => {
  // get the groupId and messageId from the req.params
  const { groupId, messageId } = req.params;

  try {
    if (!groupId || !messageId) {
      return res.status(400).json({
        success: false,
        message: "groupId/messageId is missing",
      });
    }

    // find the update the group by add the reported message ID in the group.reportedMessages
    await Group.findByIdAndUpdate(groupId, {
      $addToSet: { reportedMessages: messageId },
    });

    return res.status(200).json({
      success: true,
      message: "Message has been reported",
    });
  } catch (error) {
    console.log(
      "Errror in the report message controller function: ",
      error.message
    );
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// dismissReportedMessage controller function
exports.dismissReportedMessage = async (req, res) => {
  // get the groupId and messageId from req.params
  const { messageId, groupId } = req.params;

  try {
    // validation
    if (!messageId || !groupId) {
      return res.status(400).json({
        success: false,
        message: "messageId/groupId is missing",
      });
    }

    // pull the messageId from the group->reportedMessage
    await Group.findByIdAndUpdate(groupId, {
      $pull: { reportedMessages: messageId },
    });

    // send the success response
    return res.status(200).json({
      success: true,
      message: "Successfully dismissed",
    });
  } catch (error) {
    console.log(
      "Error in the dismiss reported message controller function: ",
      error.message
    );
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// deleteReportedMessage controller function
exports.deleteReportedMessage = async (req, res) => {
  // get the messageId and groupId from the req.params
  const { messageId, groupId } = req.params;

  try {
    // validation
    if (!messageId || !groupId) {
      return res.status(400).json({
        success: false,
        message: "messageId/groupId is missing",
      });
    }

    // delete the message
    await Message.findByIdAndDelete(messageId);

    // remove the messageId from the group->reportedMessages
    await Group.findByIdAndUpdate(groupId, {
      $pull: { reportedMessages: messageId },
    });

    // return success response
    return res.status(200).json({
      success: true,
      message: "Message deleted",
    });
  } catch (error) {
    console.log(
      "Error in the delete reported message controller function: ",
      error.message
    );
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
