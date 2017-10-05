const mongoose = require('mongoose');
const promisify = require('es6-promisify');
const passport = require('passport');
const crypto = require('crypto');
const mail = require('./mailHandler');
const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');

const multerOptions = {
  storage: multer.memoryStorage(),
  fileFilter(req, file, next) {
    if (file.mimetype.startsWith('image/')) return next(null, true);
    return next({ message: 'That filetype is not allowed' }, false);
  },
};

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
  if (req.isAuthenticated()) return next();
  req.flash('error', 'You must be logged in to do that.');
  return res.redirect(`/account/login?ref=${req.originalUrl}`);
};

exports.login = function(req, res, next) {
  passport.authenticate('local', function(err, user, info){
    const ref = req.query.ref ? `?ref=${req.query.ref}` : '/';
    if (err) return next(err);
    if (!user) {
      req.flash('error', 'Try again');
      return res.redirect('/account/login' + ref);
    }
    req.logIn(user, function(err) {
      if (err) return next(err);
      req.flash('Logged In');
      return res.redirect(req.query.ref || '/');
    });
  })(req, res, next);
};

exports.loginForm = (req, res) => res.render('account/login', { title: 'Login' });

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

exports.resizePhoto = async (req, res, next) => {
  if (!req.file) return next();
  const extension = req.file.mimetype.split('/')[1];
  req.body.photo = `${uuid.v4()}.${extension}`;
  const photo = await jimp.read(req.file.buffer);
  await photo.resize(500, jimp.AUTO);
  await photo.write(`./public/images/uploads/${req.body.photo}`);
  return next();
};

exports.updateAccount = async (req, res) => {
  const updates = {
    photo: req.body.photo,
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

exports.uploadPhoto = multer(multerOptions).single('photo');

exports.validatePasswordReset = (req, res, next) => {
  if (req.body.password === req.body['confirm-password']) return next();
  req.flash('error', 'Passwords do not match');
  return res.redirect('back');
};

exports.validateRegister = async (req, res, next) => {
  req.sanitizeBody('username');
  req.checkBody('username', 'Please supply a username!').notEmpty();
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
