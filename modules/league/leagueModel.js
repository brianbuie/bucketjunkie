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
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    moderator: {
      type: Boolean,
      default: false
    },
    shareToken: {
      type: String,
      default: shortId.generate
    },
    refererToken: {
      type: String,
      default: null
    },
    joined: {
      type: Date,
      default: Date.now
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
