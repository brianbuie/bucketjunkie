const nodemailer = require('nodemailer');
const pug = require('pug');
const juice = require('juice');
const htmlToText = require('html-to-text');
const promisify = require('es6-promisify');
const log = require('./logService');

const smtpTransport = {
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
};

const trapTransport = {
  host: process.env.MAILTRAP_HOST,
  port: process.env.MAILTRAP_PORT,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS,
  },
};

const transport = process.env.TRAP_MAIL == "true"
  ? nodemailer.createTransport(trapTransport)
  : nodemailer.createTransport(smtpTransport);

if (process.env.DEBUG) {
  transport.verify((error, success) => {
    if (error) return log.error(error);
    log.success(`Mail transport ready to send from ${transport.options.host}`);
  });
}

const generateHTML = (options = {}) => juice(pug.render(`
doctype html
html
  head
  body
    h2 Password Reset
    p Hello. You have requested a password reset. Please click 
      a(href="${options.resetURL}") here
      span  to continue on with resetting your password or visit ${options.resetURL} in your browser.
    p Please note this link is only valid for the next hour.
    p If you didn't request this email, please ignore it.
`));

exports.send = async (options) => {
  const html = generateHTML(options);
  const text = htmlToText.fromString(html);
  const mailOptions = {
    from: 'BucketJunkie <noreply@bucketjunkie.com>',
    to: options.user.email,
    subject: options.subject,
    html,
    text,
  };
  const sendMail = promisify(transport.sendMail, transport);
  return sendMail(mailOptions);
};
