const mongoose = require('mongoose');
const moment = require('moment');

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
    default: moment().add(1, 'days').startOf('day')
  },
  players: [{
    type: Number,
    ref: 'Player'
  }],
});

module.exports = mongoose.model('Roster', rosterSchema);