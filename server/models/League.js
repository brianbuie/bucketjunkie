const mongoose = require('mongoose');
const moment = require('moment');
const schedule = require('node-schedule');
const rosterService = require('../services/rosterService');

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

leagueSchema.virtual('started').get(function() {
  return moment(this.start).isBefore();
});

leagueSchema.virtual('drafting').get(function() {
  return !this.started && this.uniqueRosters
});

leagueSchema.statics.jobs = {};


leagueSchema.pre('save', function(next) {
  if (!this.isModified('start') || !this.uniqueRosters) return next();
  console.log(`Scheduling autodraft for ${this.name} \t${this.start}`);
  if (this.constructor.jobs[this.id]) {
    console.log(`canceling previous autodraft for ${this.name}`);
    this.constructor.jobs[this.id].cancel();
  }
  this.populate('members');
  const league = this;
  this.constructor.jobs[this.id] = schedule.scheduleJob(this.start, function() { 
    rosterService.autoDraft(league);
  });
  return next();
});


module.exports = mongoose.model('League', leagueSchema);
