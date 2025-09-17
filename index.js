const express = require("express");
// const app = express();

const { app, server } = require("./config/socket");

const cookieParser = require("cookie-parser");
const cors = require("cors");
const expressFileUpload = require("express-fileupload");

const connectDB = require("./config/database.config");
const connectToCloudinary = require("./config/cloudinary.config");

const userRoutes = require("./routes/user.route");
const adminRoutes = require("./routes/admin.route");
const groupRoutes = require("./routes/group.route");
const deptRoutes = require("./routes/department.route");
const sectionRoutes = require("./routes/section.route");
const messageRoutes = require("./routes/message.route");

require("dotenv").config();

const PORT = process.env.PORT || 3000;

// coneect to the database
connectDB();
// coneect to the cloudinary
connectToCloudinary();

// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
  expressFileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// cors
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/group", groupRoutes);
app.use("/api/v1/department", deptRoutes);
app.use("/api/v1/section", sectionRoutes);
app.use("/api/v1/message", messageRoutes);

// default route
app.get("/", (req, res) => {
  return res.send("AnonChat is working");
});

// listen to the server
server.listen(PORT, () =>
  console.log(`server is running at http://localhost:${PORT}`)
);
