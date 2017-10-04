const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  league: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'League',
    required: 'Please supply a league',
  },
  user1: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  user2: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  category: String,
  message: {
    type: String,
    trim: true,
    required: 'Please supply a message',
  },
  affected: String,
  date: {
    type: Date,
    default: Date.now,
  },
  hidden: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('Activity', activitySchema);
