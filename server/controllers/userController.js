const mongoose = require('mongoose');
const promisify = require('es6-promisify');
const passport = require('passport');
const crypto = require('crypto');
const mail = require('../services/mailService');
const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');
const cloudinary = require('cloudinary');

const User = mongoose.model('User');

exports.login = function(req, res, next) {
  passport.authenticate('local', function(err, user, info){
    if (err) return next(err);
    if (!user) return res.oops('Try again');
    req.logIn(user, function(err) {
      if (err) return next(err);
      return res.greatJob({ message: 'Logged In', user });
    });
  })(req, res, next);
};

exports.logout = (req, res) => {
  req.logout();
  req.session.league = undefined;
  return res.greatJob('Logged Out');
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

exports.uploadPhoto = multer({
    storage: multer.memoryStorage(),
    fileFilter(req, file, next) {
      if (file.mimetype.startsWith('image/') && file.mimetype.split('/')[1] != 'gif') return next(null, true);
      return next({ message: 'That filetype is not allowed' }, false);
    },
  }).single('photo');

exports.resizePhoto = async (req, res, next) => {
  if (!req.file) throw Error('No Image');
  const extension = req.file.mimetype.split('/')[1];
  req.body.photo = `${uuid.v4()}.${extension}`;
  const photo = await jimp.read(req.file.buffer);
  await photo.resize(500, jimp.AUTO);
  await photo.write(`./client/public/images/uploads/${req.body.photo}`);
  return next();
};

// exports.sendToCloudinary = (req, res, next) => {
//   cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_KEY,
//     api_secret: process.env.CLOUDINARY_SCRET
//   });
//   cloudinary.v2.uploader.upload_stream({ resource_type: 'raw' },
//     function(result) {
//       console.log(result);
//       return res.oops({ message: 'cloudinary callback', error, result });
//     }
//   ).end(req.file.buffer);
// };

exports.updateAccount = async (req, res) => {
  req.user.set({ photo: req.body.photo });
  await req.user.save(err => err ? new Error(err.message) : null);
  return res.greatJob({ message: 'Updated profile', user: req.user });
};

exports.createResetToken = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.oops('No user found with that e-mail address');
  user.resetPasswordToken = crypto.randomBytes(20).toString('hex');
  user.resetPasswordExpires = Date.now() + 3600000;
  await user.save();
  const resetURL = `http://${req.headers.host}?password-reset=${user.resetPasswordToken}`;
  await mail.send({
    user,
    subject: 'BucketJunkie Password Reset',
    resetURL,
  }).catch(e => console.log(e));
  return res.greatJob('You have been emailed a password reset link.');
};

exports.validatePasswordToken = async (req, res) => {
  const user = await User.findOne({
    resetPasswordToken: req.body.token,
    resetPasswordExpires: { $gt: Date.now() },
  });
  if (!user) {
    return res.oops('Password reset is invalid or has expired');
  }
  return res.greatJob('Password Token Valid');
};

exports.updatePassword = async (req, res) => {
  const user = await User.findOne({
    resetPasswordToken: req.body.token,
    resetPasswordExpires: { $gt: Date.now() },
  });
  if (!user) {
    return res.oops('Password reset is invalid or has expired');
  }
  const setPassword = promisify(user.setPassword, user);
  await setPassword(req.body.password);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  const updatedUser = await user.save();
  await req.login(updatedUser);
  return res.greatJob({ message: 'Password Reset', user: updatedUser });
};

exports.validatePasswordReset = (req, res, next) => {
  if (req.body.password === req.body['confirm-password']) return next();
  return res.oops('Passwords do not match');
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
      return res.oops({ message: errors.map(err => err.msg).join(', ')});
    });
};
