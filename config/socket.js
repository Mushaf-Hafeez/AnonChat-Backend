const express = require("express");
const app = express();

require("dotenv").config();

// create HTTP server
const { createServer } = require("http");
const server = createServer(app);

// create socket server
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
  },
});

io.on("connection", (socket) => {
  // console.log("New connection: ", socket.id);

  // join room event
  socket.on("join-room", (roomIDs) => {
    if (Array.isArray(roomIDs) && roomIDs.length !== 0) {
      for (const roomID of roomIDs) {
        socket.join(roomID._id);
      }
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected: ", socket.id);
  });
});

module.exports = { app, server, io };
