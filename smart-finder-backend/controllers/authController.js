const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  normalizeString,
  isBcryptHash
} = require("../utils/validation");

const escapeRegex = value =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const findUserByLoginId = loginId =>
  User.findOne({
    email: {
      $regex: `^${escapeRegex(loginId)}$`,
      $options: "i"
    }
  });

// REGISTER
exports.register = async (req, res) => {
  try {
    const name = normalizeString(req.body.name);
    const email = normalizeString(req.body.email);
    const password =
      typeof req.body.password === "string" ? req.body.password : "";

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    if (!email) {
      return res.status(400).json({
        message: "Login ID is required"
      });
    }

    if (!password) {
      return res.status(400).json({
        message: "Password is required"
      });
    }

    const existingUser = await findUserByLoginId(email);

    if (existingUser) {
      return res.status(400).json({
        message: "User with this email already exists"
      });
    }

    await User.create({ name, email, password });

    return res.status(201).json({
      message: "Registered successfully"
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const email = normalizeString(req.body.email);
    const password =
      typeof req.body.password === "string" ? req.body.password : "";

    if (!email || !password) {
      return res.status(400).json({
        message: "Login ID and password are required"
      });
    }

    const user = await findUserByLoginId(email);

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password"
      });
    }

    const passwordMatches = await user.isPasswordMatch(password);

    if (!passwordMatches) {
      return res.status(400).json({
        message: "Invalid email or password"
      });
    }

    if (!isBcryptHash(user.password)) {
      user.password = await bcrypt.hash(password, 12);
      await user.save();
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not configured");
      return res.status(500).json({
        message: "Authentication is unavailable"
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      token,
      role: user.role,
      name: user.name,
      email: user.email
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};
