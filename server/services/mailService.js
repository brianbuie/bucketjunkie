const nodemailer = require('nodemailer');
const pug = require('pug');
const juice = require('juice');
const htmlToText = require('html-to-text');
const promisify = require('es6-promisify');

const transport = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

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
