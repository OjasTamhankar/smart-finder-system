require("dotenv").config();

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");

const authRoutes = require("./routes/authRoutes");
const lostRoutes = require("./routes/lostRoutes");
const adminRoutes = require("./routes/adminRoutes");
const foundRoutes = require("./routes/foundRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();
const port = Number(process.env.PORT || 5000);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

app.use("/auth", authRoutes);
app.use("/lost", lostRoutes);
app.use("/api/lost-items", lostRoutes);
app.use("/admin", adminRoutes);
app.use("/found", foundRoutes);
app.use("/notifications", notificationRoutes);
app.use("/api/users", userRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(port, () =>
      console.log(`Server running on port ${port}`)
    );
  })
  .catch(err => console.error(err));

app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        message: "Uploaded file is too large. Maximum size is 5MB."
      });
    }

    return res.status(400).json({ message: err.message });
  }

  if (err instanceof Error) {
    if (err.message === "Only image files are allowed") {
      return res.status(400).json({ message: err.message });
    }

    console.error("Unhandled request error:", err);
    return res.status(500).json({ message: "Server error" });
  }

  return next();
});
