const mongoose = require('mongoose');
const shortId = require('shortid');

const leagueSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: shortId.generate
  },
  name: {
    type: String,
    trim: true,
    required: 'Please enter a League name.',
  },
  description: {
    type: String,
    trim: true,
  },
  created: {
    type: Date,
    default: Date.now,
  },
  // creator: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'User',
  //   required: true,
  // },
  // mods: [{
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'User',
  // }],
  // members: [{
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'User',
  // }],
  public: {
    type: Boolean,
    default: false,
  },
});

leagueSchema.index({
  _id: mongoose.Schema.Types.ObjectId,
});

module.exports = mongoose.model('League', leagueSchema);
