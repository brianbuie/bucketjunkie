const mongoose = require('mongoose');
const promisify = require('es6-promisify');
const passport = require('passport');
const crypto = require('crypto');
const mail = require('./mailHandler');

const User = mongoose.model('User');

exports.account = (req, res) => res.render('account/account', { title: 'Account' });

exports.createResetToken = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    req.flash('error', 'No user found with that e-mail address');
    return res.redirect('/account/forgot-password');
  }
  user.resetPasswordToken = crypto.randomBytes(20).toString('hex');
  user.resetPasswordExpires = Date.now() + 3600000;
  await user.save();
  const resetURL = `http://${req.headers.host}/account/reset-password/${user.resetPasswordToken}`;
  mail.send({
    user,
    subject: 'Password Reset',
    resetURL,
    filename: 'password-reset',
  });
  req.flash('success', 'You have been emailed a password reset link.');
  return res.redirect('/account/login');
};

exports.forgotPasswordForm = (req, res) => res.render('account/forgot-password', { title: 'Forgot Password' });

exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) next();
  req.flash('error', 'You must be logged in to do that.');
  return res.redirect('/account/login');
};

exports.login = passport.authenticate('local', {
  failureRedirect: '/account/login',
  failureFlash: 'Try again',
  successRedirect: '/',
  successFlash: 'Logged In',
});

exports.loginForm = (req, res) => res.render('account/login', { title: 'Login' });

exports.logout = (req, res) => {
  req.logout();
  req.flash('success', 'logged out');
  return res.redirect('/');
};

exports.register = async (req, res, next) => {
  const user = new User({
    email: req.body.email,
    username: req.body.username,
  });
  const register = promisify(User.register, User);
  await register(user, req.body.password);
  next();
};

exports.registerForm = (req, res) => res.render('account/register', { title: 'Register' });

exports.resetPasswordForm = async (req, res) => {
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() },
  });
  if (!user) {
    req.flash('error', 'Password reset is invalid or has expired');
    return res.redirect('/account/forgot-password');
  }
  return res.render('account/reset-password', { title: 'Reset your password' });
};

exports.updateAccount = async (req, res) => {
  const updates = {
    username: req.body.username,
    email: req.body.email,
  };
  await User.findOneAndUpdate(
    { _id: req.user._id },
    { $set: updates },
    { new: true, runValidators: true, context: 'query' },
  );
  req.flash('success', 'Updated profile');
  return res.redirect('back');
};

exports.updatePassword = async (req, res) => {
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() },
  });
  if (!user) {
    req.flash('error', 'Password reset is invalid or has expired');
    return res.redirect('/account/forgot-password');
  }
  const setPassword = promisify(user.setPassword, user);
  await setPassword(req.body.password);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  const updatedUser = await user.save();
  await req.login(updatedUser);
  req.flash('success', 'Your password has been reset');
  return res.redirect('/');
};

exports.validatePasswordReset = (req, res, next) => {
  if (req.body.password === req.body['confirm-password']) return next();
  req.flash('error', 'Passwords do not match');
  return res.redirect('back');
};

exports.validateRegister = (req, res, next) => {
  req.sanitizeBody('username');
  req.checkBody('username', 'Please supply a username!').notEmpty();
  req.checkBody('email', 'Please enter a valid email address').isEmail();
  req.sanitizeBody('email').normalizeEmail({
    remove_dots: false,
    remove_extension: false,
    gmail_remove_subaddress: false,
  });
  req.checkBody('password', 'Please enter a password').notEmpty();
  req.checkBody('confirm-password', 'Please confirm your password').notEmpty();
  req.checkBody('confirm-password', 'Your passwords don\'t match').equals(req.body.password);
  const errors = req.validationErrors();
  if (errors) {
    req.flash('error', errors.map(err => err.msg));
    return res.render('account/register', {
      title: 'Register',
      body: req.body,
      flashes: req.flash(),
    });
  }
  return next();
};
