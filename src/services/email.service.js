const nodemailer = require("nodemailer");
const config = require("../configs/configs");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: config.EMAIL_USER,
    clientId: config.CLIENT_ID,
    clientSecret: config.CLIENT_SECRET,
    refreshToken: config.REFRESH_TOKEN,
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error("Error connecting to email server:", error);
  } else {
    console.log("Email server is ready to send messages");
  }
});

// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Backend Ledger" <${config.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

async function sendRegistrationEmail(email, username) {
  const subject = "Welcome to Backend Ledger!";
  const text = `Hello ${username},\n\nThank you for registering with Backend Ledger! We're excited to have you on board.\n\nBest regards,\nThe Backend Ledger Team`;
  const html = `<p>Hello ${username},</p><p>Thank you for registering with <strong>Backend Ledger</strong>! We're excited to have you on board.</p><p>Best regards,<br>The Backend Ledger Team</p>`;

  await sendEmail(email, subject, text, html);
}

async function sendTransactionEmail(email, username, transactionDetails) {
  const subject = "Transaction Notification";
  const text = `Hello ${username},\n\nA new transaction has been made:\n${transactionDetails}\n\nBest regards,\nThe Backend Ledger Team`;
  const html = `<p>Hello ${username},</p><p>A new transaction has been made:</p><p>${transactionDetails}</p><p>Best regards,<br>The Backend Ledger Team</p>`;

  await sendEmail(email, subject, text, html);
}

async function sendTransactionFailureEmail(
  email,
  username,
  transactionDetails,
) {
  const subject = "Transaction Failure Notification";
  const text = `Hello ${username},\n\nWe regret to inform you that your recent transaction has failed:\n${transactionDetails}\n\nPlease check your account and try again.\n\nBest regards,\nThe Backend Ledger Team`;
  const html = `<p>Hello ${username},</p><p>We regret to inform you that your recent transaction has failed:</p><p>${transactionDetails}</p><p>Please check your account and try again.</p><p>Best regards,<br>The Backend Ledger Team</p>`;
  await sendEmail(email, subject, text, html);
}

module.exports = {
  sendRegistrationEmail,
  sendTransactionEmail,
  sendTransactionFailureEmail,
};
