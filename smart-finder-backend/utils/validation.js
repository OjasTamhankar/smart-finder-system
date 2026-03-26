const mongoose = require("mongoose");

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const BCRYPT_HASH_REGEX = /^\$2[aby]\$\d{2}\$/;

const normalizeString = value =>
  typeof value === "string" ? value.trim() : "";

const normalizeEmail = value =>
  normalizeString(value).toLowerCase();

const isValidEmail = value => EMAIL_REGEX.test(normalizeEmail(value));

const isValidObjectId = value =>
  mongoose.Types.ObjectId.isValid(value);

const isBcryptHash = value =>
  typeof value === "string" && BCRYPT_HASH_REGEX.test(value);

const escapeHtml = value =>
  String(value ?? "").replace(
    /[&<>"']/g,
    character =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      })[character]
  );

module.exports = {
  normalizeString,
  normalizeEmail,
  isValidEmail,
  isValidObjectId,
  isBcryptHash,
  escapeHtml
};
