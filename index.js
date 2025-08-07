const express = require("express");
const app = express();
const connectDB = require("./config/database.config");

require("dotenv").config();

const PORT = process.env.PORT || 3000;

// coneect to the database
connectDB();

// middlewares
app.use(express.json());

// default route
app.get("/", (req, res) => {
  return res.send("AnonChat is working");
});

// listen to the server
app.listen(PORT, () =>
  console.log(`server is running at http://localhost:${PORT}`)
);
