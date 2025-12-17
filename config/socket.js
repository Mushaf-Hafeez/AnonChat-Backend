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

const users = {};

io.on("connection", (socket) => {
  console.log(`A new user joined: ${socket.id}`);

  // store userId in users
  socket.on("userId", (userId) => {
    users[userId] = socket.id;
    // store it in socket obj
    socket.userId = userId;
  });

  // join room event
  socket.on("join-room", (roomIDs) => {
    for (const roomID of roomIDs) {
      socket.join(roomID._id);
      console.log(`user ${socket.id} joined ${roomID._id}`);
    }
  });

  // socket disconnect event
  socket.on("disconnect", () => {
    console.log("User disconnected: ", socket.id);
    if (socket.userId && users[socket.userId]) {
      delete users[socket.userId];
    }
  });
});

module.exports = { app, server, io, users };
