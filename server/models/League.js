const mongoose = require('mongoose');
const moment = require('moment');

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
  open: {
    type: Boolean,
    default: true,
  },
  start: {
    type: Date,
    default: moment().add(1, 'days')
  },
  started: {
    type: Boolean,
    default: false
  },
  public: {
    type: Boolean,
    default: false,
  },
  deleted: {
    type: Boolean,
    default: false
  },
  created: {
    type: Date,
    default: Date.now,
  },
}, {
  toObject: { virtuals: true },
  toJSON: { virtuals: true }
});

leagueSchema.virtual('drafting').get(function() {
  return !this.started && this.uniqueRosters
});

module.exports = mongoose.model('League', leagueSchema);
