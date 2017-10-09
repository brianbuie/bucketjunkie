const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  _id: {
    type: Number,
    index: true,
    unique: true,
    required: true,
  },
  city: String,
  name: String,
  full_name: String,
  abbreviation: String,
});

module.exports = mongoose.model('Team', teamSchema);
