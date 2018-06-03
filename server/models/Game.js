const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  _id: {
    type: Number,
    required: true,
  },
  home: {
    type: Number,
    ref: 'Team'
  },
  away: {
    type: Number,
    ref: 'Team'
  },
  season: Number,
  date: Date,
  final: Boolean
});

module.exports = mongoose.model('Game', gameSchema);
