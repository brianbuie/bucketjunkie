const mongoose = require('mongoose');
const nbaService = require('../services/nbaService');

const Box = mongoose.model('Box');

exports.playerBoxscores = async (req, res) => {
  const boxscores = await Box.find({ player: req.params.id }).populate('game');
  return res.greatJob({ boxscores });
};