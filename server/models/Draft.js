const mongoose = require('mongoose');

const draftSchema = new mongoose.Schema({
  league: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'League',
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  players: [{
    type: Number,
    ref: 'Player'
  }],
});

module.exports = mongoose.model('Draft', draftSchema);