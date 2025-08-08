const express = require("express");
const app = express();
const connectDB = require("./config/database.config");
const connectToCloudinary = require("./config/cloudinary.config");
const userRoutes = require("./routes/user.route");

require("dotenv").config();

const PORT = process.env.PORT || 3000;

// coneect to the database
connectDB();
// coneect to the cloudinary
connectToCloudinary();

// middlewares
app.use("/api/v1");
app.use(express.json());

// routes
app.use("/auth", userRoutes);

// default route
app.get("/", (req, res) => {
  return res.send("AnonChat is working");
});

// listen to the server
app.listen(PORT, () =>
  console.log(`server is running at http://localhost:${PORT}`)
);
