const mongoose = require('mongoose');

const leagueSchema = new mongoose.Schema({
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
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  open: {
    type: Boolean,
    default: true,
  },
  public: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('League', leagueSchema);
