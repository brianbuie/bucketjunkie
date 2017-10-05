const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  _id: {
    type: Number,
    index: true,
    unique: true,
    required: true,
  },
  home_id: {
    type: Number,
    ref: 'Team'
  },
  away_id: {
    type: Number,
    ref: 'Team'
  },
  date: Date,
  final: Boolean
});

module.exports = mongoose.model('Game', gameSchema);
