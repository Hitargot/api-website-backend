// utils/sendEmail.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,  // Your email user
    pass: process.env.EMAIL_PASS,  // Your email password
  },
});

const sendEmail = async (to, subject, text) => {
  try {
    const mailOptions = {
      from: `"APIs market Admin" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: text,  // Send HTML email content
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;  // Re-throw error to handle it in the controller
  }
};

module.exports = { sendEmail };
