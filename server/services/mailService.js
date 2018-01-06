const nodemailer = require('nodemailer');
const pug = require('pug');
const juice = require('juice');
const htmlToText = require('html-to-text');
const promisify = require('es6-promisify');

const transport = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// verify connection configuration
transport.verify(function(error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log('Server is ready to take our messages');
  }
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
