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
  averages: {
    ftm: { type: Number, default: 0 },
    fg2m: { type: Number, default: 0 },
    fg3m: { type: Number, default: 0 },
    reb: { type: Number, default: 0 },
    ast: { type: Number, default: 0 },
    blk: { type: Number, default: 0 },
    stl: { type: Number, default: 0 },
    to: { type: Number, default: 0 },
  },
  name: String,
  first_name: String,
  last_name: String,
  position: String
});

playerSchema.statics.getAverages = function(id) {
  return this.aggregate([
    { $match: { _id: id } },
    { $lookup: { 
        from: 'boxes', 
        localField: '_id', 
        foreignField: 'player', 
        as: 'boxes' 
    } },
    { $project: {
        _id: '$$ROOT._id',
        team: '$$ROOT.team',
        name: '$$ROOT.name',
        first_name: '$$ROOT.first_name',
        last_name: '$$ROOT.last_name',
        position: '$$ROOT.position',
        averages: {
          ftm: { $avg: '$boxes.ftm' },
          fg2m: { $avg: '$boxes.fg2m' },
          fg3m: { $avg: '$boxes.fg3m' },
          reb: { $avg: '$boxes.reb' },
          ast: { $avg: '$boxes.ast' },
          blk: { $avg: '$boxes.blk' },
          stl: { $avg: '$boxes.stl' },
          to: { $avg: '$boxes.to' },
        }
    } },
  ]);
};

module.exports = mongoose.model('Player', playerSchema);
