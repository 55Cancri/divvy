// builds transport object to send emails

import nodemailer from 'nodemailer'

const transport = nodemailer.createTransport({
  // in mail gun, go to malin1 domain
  service: 'Mailgun',
  auth: {
    // user is value for "Default SMTP Login" under "Domain Information"
    user: 'postmaster@malin1.com',
    // pass is value for "Default Password" under "Domain Information"
    pass: 'f39580045e90a00835232b84bb3effd5'
  },
  tls: {
    rejectUnauthorized: false
  }
})

export default transport