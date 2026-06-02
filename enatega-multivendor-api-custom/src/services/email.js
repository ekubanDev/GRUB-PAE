const nodemailer = require('nodemailer')

function createTransport() {
  if (process.env.SENDGRID_API_KEY) {
    return nodemailer.createTransporter({
      host: 'smtp.sendgrid.net',
      port: 587,
      auth: {
        user: 'apikey',
        pass: process.env.SENDGRID_API_KEY
      }
    })
  }
  // Fallback to SMTP (configured via Configuration model)
  return nodemailer.createTransporter({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD
    }
  })
}

async function sendEmail({ to, subject, html, text }) {
  const transporter = createTransport()
  return transporter.sendMail({
    from: `"${process.env.SENDGRID_FROM_NAME || 'GRUB-PAE'}" <${process.env.SENDGRID_FROM_EMAIL}>`,
    to,
    subject,
    html,
    text
  })
}

async function sendOrderConfirmation({ to, order }) {
  return sendEmail({
    to,
    subject: `GRUB-PAE — Order #${order.orderId} Confirmed`,
    html: `<p>Your order has been placed. Order ID: <strong>${order.orderId}</strong></p>`
  })
}

async function sendPasswordReset({ to, resetLink }) {
  return sendEmail({
    to,
    subject: 'GRUB-PAE — Reset Your Password',
    html: `<p>Click <a href="${resetLink}">here</a> to reset your password. This link expires in 1 hour.</p>`
  })
}

module.exports = { sendEmail, sendOrderConfirmation, sendPasswordReset }
