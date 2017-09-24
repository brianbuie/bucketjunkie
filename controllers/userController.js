const mongoose = require('mongoose');
const User = mongoose.model('User');
const promisify = require('es6-promisify');

exports.loginForm = (req, res) => {
  res.render('account/login', { title: 'Login' });
};

exports.registerForm = (req, res) => {
  res.render('account/register', { title: 'Register' });
};

exports.forgotPassword = (req, res) => {
  res.render('account/forgot-password', { title: 'Forgot Password' });
};

exports.validateRegister = (req, res, next) => {
  req.sanitizeBody('username');
  req.checkBody('username', 'Please supply a username!').notEmpty();
  req.checkBody('email', 'Please enter a valid email address').isEmail();
  req.sanitizeBody('email').normalizeEmail({
    remove_dots: false,
    remove_extension: false,
    gmail_remove_subaddress: false
  });
  req.checkBody('password', 'Please enter a password').notEmpty();
  req.checkBody('confirm-password', 'Please confirm your password').notEmpty();
  req.checkBody('confirm-password', 'Your passwords don\'t match').equals(req.body.password);
  const errors = req.validationErrors();
  if (errors) {
    req.flash('error', errors.map(err => err.msg));
    res.render('account/register', { 
      title: 'Register', 
      body: req.body,
      flashes: req.flash() 
    });
    return;
  }
  next();
};

exports.register = async (req, res, next) => {
  const user = new User({ 
    email: req.body.email, 
    username: req.body.username 
  });
  const register = promisify(User.register, User);
  await register(user, req.body.password);
  next();
};