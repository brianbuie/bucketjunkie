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
  roster: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Roster',
  },
  box: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Box',
  },
  points: Number
});

module.exports = mongoose.model('Roster', rosterSchema);