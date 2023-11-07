const nodemailer = require('nodemailer');


const sendMail = (sendTo, subject, body) => {
  if (!sendTo) throw Error("Send to email is required while sending email");
  if (!subject) throw Error("Subject is required on email");
  if (!body) throw Error("Body is required on email");
  const transporter = nodemailer.createTransport({
    service: 'Gmail', // Use your email service provider (e.g., 'Gmail', 'Outlook', etc.)
    auth: {
      user: 'vikas.chauhan.bb@gmail.com',
      pass: process.env.GOOGLE_APP_PASSWORD,
    },
  });
  const mailOptions = {
    from: 'no-reply@sms.com',
    to: sendTo,
    subject: subject,
    text: body,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      throw Error("Error sending email: " + error);
    } else {
      // console.log('Email sent:', info.response);
      return "Email sent successfully to " + sendTo;
    }
  });
}

module.exports = sendMail;