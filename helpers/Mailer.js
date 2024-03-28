var nodemailer = require("nodemailer");
require("dotenv").config();

let transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: "michael@360ground.com",
    pass: process.env.EMAIL_PASSWORD,
  },
});

module.exports = transporter;
