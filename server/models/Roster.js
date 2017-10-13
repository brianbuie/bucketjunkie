const mongoose = require('mongoose');

const rosterSchema = new mongoose.Schema({
  league: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'League',
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  effective: {
    type: Date,
    default: Date.now
  },
  players: [{
    type: Number,
    ref: 'Player'
  }],
});

rosterSchema.statics.effectiveAt = function(date) {
  return this.aggregate([
    { $match: { effective: { $lt: date } } },
    { $sort: { effective: 1 } },
    { $group: { _id: "$league", user: "$user" } }
  ]);
};

module.exports = mongoose.model('Roster', rosterSchema);