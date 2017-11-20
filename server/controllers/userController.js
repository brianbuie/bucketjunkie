const mongoose = require('mongoose');
const promisify = require('es6-promisify');
const passport = require('passport');
const crypto = require('crypto');
const mail = require('../services/mailService');
const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');

const User = mongoose.model('User');

exports.createResetToken = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return req.oops('No user found with that e-mail address');
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

exports.login = function(req, res, next) {
  passport.authenticate('local', function(err, user, info){
    if (err) return next(err);
    if (!user) return req.oops('Try again');
    req.logIn(user, function(err) {
      if (err) return next(err);
      return res.status(200).json({ message: 'Logged In', user });
    });
  })(req, res, next);
};

exports.loginForm = (req, res) => res.render('account/login', { title: 'Login', body: req.body });

exports.logout = (req, res) => {
  req.logout();
  req.session.league = undefined;
  req.flash('success', 'logged out');
  return res.redirect('/');
};

exports.register = async (req, res, next) => {
  const user = new User({
    email: req.body.email,
    username: req.body.username.toLowerCase(),
  });
  const register = promisify(User.register, User);
  await register(user, req.body.password);
  return next();
};

exports.registerForm = (req, res) => res.render('account/register', { title: 'Register', body: req.body });

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

exports.uploadPhoto = multer({
    storage: multer.memoryStorage(),
    fileFilter(req, file, next) {
      if (file.mimetype.startsWith('image/')) return next(null, true);
      return next({ message: 'That filetype is not allowed' }, false);
    },
  }).single('photo');

exports.resizePhoto = async (req, res, next) => {
  if (!req.file) return next();
  const extension = req.file.mimetype.split('/')[1];
  req.body.photo = `${uuid.v4()}.${extension}`;
  const photo = await jimp.read(req.file.buffer);
  await photo.resize(500, jimp.AUTO);
  await photo.write(`./client/public/images/uploads/${req.body.photo}`);
  return next();
};

exports.updateAccount = async (req, res) => {
  const updates = {
    photo: req.body.photo,
  };
  let user = await User.findOneAndUpdate(
    { _id: req.user._id },
    { $set: updates },
    { new: true, runValidators: true, context: 'query' },
  );
  return res.status(200).json({ message: 'Updated profile', user });
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

exports.validateRegister = async (req, res, next) => {
  req.sanitizeBody('username');
  req.checkBody('username', 'Please supply a username!').notEmpty();
  req.checkBody('username', 'Usernames must be less than 15 characters').isLength({ max: 15 });
  req.checkBody('username', 'You can only use letters, numbers, dashes, and underscores in your username')
    .custom(username => /^[a-zA-Z0-9-_]+$/g.test(username));
  req.checkBody('username', 'Username taken').custom(username => {
    return new Promise((resolve, reject) => {
      User.findOne({ username: username.toLowerCase().trim() }, (err, user) => {
        if (err) throw err;
        if (!user) resolve();
        reject();
      });
    });
  });
  req.checkBody('email', 'Please enter a valid email address').isEmail();
  req.sanitizeBody('email').normalizeEmail({
    remove_dots: false,
    remove_extension: false,
    gmail_remove_subaddress: false,
  });
  req.checkBody('password', 'Please enter a password').notEmpty();
  req.checkBody('confirm-password', 'Please confirm your password').notEmpty();
  req.checkBody('confirm-password', 'Your passwords don\'t match').equals(req.body.password);
  return req.asyncValidationErrors().then(() => next())
    .catch((errors) => {
      req.flash('error', errors.map(err => err.msg));
      return res.render('account/register', {
        title: 'Register',
        body: req.body,
        flashes: req.flash(),
      });
    });
};
