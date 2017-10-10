const mongoose = require('mongoose');

const boxSchema = new mongoose.Schema({
  game: {
    type: Number,
    ref: 'Game',
  },
  team: {
    type: Number,
    ref: 'Team',
  },
  player: {
    type: Number,
    ref: 'Player',
  },
  opponent: {
    type: Number,
    ref: 'Team',
  },
  period: String,
  season: Number,
  min: String,
  fgm: Number,
  fga: Number,
  fg2m: Number,
  fg2a: Number,
  fg3m: Number,
  fg3a: Number,
  ftm: Number,
  fta: Number,
  oreb: Number,
  dreb: Number,
  reb: Number,
  ast: Number,
  blk: Number,
  stl: Number,
  to: Number,
  pf: Number,
  pts: Number,
  plus_minus: Number,
}, {
  toObject: { virtuals: true },
  toJSON: { virtuals: true }
});

boxSchema.virtual('complete').get(function() {
  return this.period === "f";
});

module.exports = mongoose.model('Box', boxSchema);