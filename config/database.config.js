const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    await console.log("database connected");
  } catch (error) {
    console.log("error while connecting to database: ", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
