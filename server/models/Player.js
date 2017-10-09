const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  _id: {
    type: Number,
    index: true,
    unique: true,
    required: true,
  },
  team: {
    type: Number,
    ref: 'Team'
  },
  name: String,
  first_name: String,
  last_name: String,
  position: String
});

module.exports = mongoose.model('Player', playerSchema);
