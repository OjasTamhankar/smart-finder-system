const nodemailer = require("nodemailer");

const hasCustomSmtpConfig = Boolean(process.env.EMAIL_HOST);
const hasEmailAuth = Boolean(
  process.env.EMAIL_USER && process.env.EMAIL_PASS
);

const transportConfig = hasCustomSmtpConfig
  ? {
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT || 587),
      secure:
        String(process.env.EMAIL_SECURE || "false").toLowerCase() ===
        "true",
      auth: hasEmailAuth
        ? {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          }
        : undefined
    }
  : {
      service: process.env.EMAIL_SERVICE || "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    };

const transporter = nodemailer.createTransport(transportConfig);

if (hasEmailAuth) {
  transporter
    .verify()
    .then(() =>
      console.log("Email transporter verified successfully")
    )
    .catch(error =>
      console.error("Mailer configuration error:", error.message)
    );
} else {
  console.warn(
    "Email credentials are not configured. Outbound emails will fail until EMAIL_USER/EMAIL_PASS or SMTP settings are provided."
  );
}

module.exports = transporter;
