const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { isBcryptHash } = require("../utils/validation");

const notificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true
    },
    message: {
      type: String,
      trim: true,
      required: true
    },
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LostItem",
      default: null
    },
    isRead: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { _id: true }
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      maxlength: 120
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user"
    },
    fcmToken: {
      type: String,
      default: null,
      trim: true
    },
    notifications: {
      type: [notificationSchema],
      default: []
    }
  },
  { timestamps: true }
);

userSchema.pre("save", async function handlePasswordHash() {
  if (
    !this.isModified("password") ||
    !this.password ||
    isBcryptHash(this.password)
  ) {
    return;
  }

  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.isPasswordMatch = function isPasswordMatch(password) {
  if (!this.password) {
    return Promise.resolve(false);
  }

  if (isBcryptHash(this.password)) {
    return bcrypt.compare(password, this.password);
  }

  return Promise.resolve(password === this.password);
};

module.exports = mongoose.model("User", userSchema);
