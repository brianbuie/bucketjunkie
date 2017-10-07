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
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  moderators: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  blocked: [{
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
  uniqueRosters: {
    type: Boolean,
    default: true,
  },
  rosterSize: {
    type: Number,
    default: 5,
  },
  pointValues: {
    ftm: { type: Number, default: 0 },
    fg2m: { type: Number, default: 0 }, // fgm - fg3m
    fg3m: { type: Number, default: 0 },
    reb: { type: Number, default: 0 }, // oreb + dreb
    ast: { type: Number, default: 0 },
    blk: { type: Number, default: 0 },
    stl: { type: Number, default: 0 },
    to: { type: Number, default: 0 },
  },
  deleted: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('League', leagueSchema);
