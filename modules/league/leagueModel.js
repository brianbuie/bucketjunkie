const mongoose = require('mongoose');
const shortId = require('shortid');

const leagueSchema = new mongoose.Schema({
  _id: {
    type: String,
    index: true,
    default: shortId.generate
  },
  name: {
    type: String,
    trim: true,
    required: 'Please enter a League name.',
  },
  description: {
    type: String,
    trim: true,
  },
  created: {
    type: Date,
    default: Date.now,
  },
  members: [{
    username: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    moderator: {
      type: Boolean,
      default: false
    },
    shareId: {
      type: String,
      default: shortId.generate
    },
    referer: {
      type: String,
      default: null
    }
  }],
  open: {
    type: Boolean,
    default: true
  },
  public: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('League', leagueSchema);
