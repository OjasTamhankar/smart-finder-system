const transporter = require("../config/mailer");

const defaultFromAddress =
  process.env.EMAIL_FROM ||
  process.env.EMAIL_USER ||
  "no-reply@smartfinder.local";

const sendEmail = async (to, subject, text, html) => {
  if (!to) {
    return null;
  }

  return transporter.sendMail({
    from: `"Smart Finder" <${defaultFromAddress}>`,
    to,
    subject,
    text,
    html
  });
};

module.exports = {
  sendEmail
};
