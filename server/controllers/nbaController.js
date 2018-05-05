const mongoose = require('mongoose');

const Box = mongoose.model('Box');

exports.playerBoxscores = async (req, res) => {
  const boxscores = await Box.find({ player: req.params.id }).populate('game');
  boxscores.sort((a,b) => new Date(b.game.date) - new Date(a.game.date));
  return res.greatJob({ boxscores });
};