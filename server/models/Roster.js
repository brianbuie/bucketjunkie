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

module.exports = mongoose.model('Roster', rosterSchema);