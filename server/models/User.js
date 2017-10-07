const mongoose = require('mongoose');
const validator = require('validator');
const mongodbErrorHandler = require('mongoose-mongodb-errors');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: 'Please supply a username',
    trim: true,
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
    required: 'Please Supply an email address',
  },
  photo: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

userSchema.plugin(passportLocalMongoose, { usernameLowerCase: true });
userSchema.plugin(mongodbErrorHandler);

module.exports = mongoose.model('User', userSchema);
