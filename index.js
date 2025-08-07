const express = require("express");
const app = express();

require("dotenv").config();

const PORT = process.env.PORT || 3000;

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
