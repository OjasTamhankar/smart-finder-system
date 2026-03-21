require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const lostRoutes = require("./routes/lostRoutes");
const adminRoutes = require("./routes/adminRoutes");
const foundRoutes = require("./routes/foundRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/auth", authRoutes);
app.use("/lost", lostRoutes);
app.use("/api/lost-items", lostRoutes);
app.use("/admin", adminRoutes);
app.use("/found", foundRoutes);
app.use("/notifications", notificationRoutes);
app.use("/api/users", userRoutes);

// DB + Server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(5000, () =>
      console.log("Server running on port 5000")
    );
  })
  .catch(err => console.error(err));

console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS exists:", !!process.env.EMAIL_PASS);
