const mongoose = require('mongoose');

const User = mongoose.model('User');

exports.getUsername = async id => {
  let user = await User.findOne({ _id: id });
  if (!user) throw Error('Error getting user info');
  return user.username;
};