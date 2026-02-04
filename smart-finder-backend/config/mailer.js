const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// 🔍 VERIFY CONNECTION AT STARTUP
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Mailer config error:", error.message);
  } else {
    console.log("✅ Mail server is ready to send emails");
  }
});

module.exports = transporter;
