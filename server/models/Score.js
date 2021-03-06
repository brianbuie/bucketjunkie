const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
  league: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'League',
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  roster: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Roster',
  },
  player: {
    type: Number,
    ref: 'Player',
  },
  box: {
    type: Number,
    ref: 'Box',
  },
  points: Number,
  date: {
    type: Date,
    default: Date.now
  },
});

scoreSchema.statics.getTotalScores = function(leagueId) {
  return this.aggregate([
    { $match: { league: leagueId } },
    { $group: { _id: '$user', score: { $sum: '$points' } } }
  ]);
}

module.exports = mongoose.model('Score', scoreSchema);