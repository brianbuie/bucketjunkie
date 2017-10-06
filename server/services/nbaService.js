const mongoose = require('mongoose');

const Player = mongoose.model('Player');

exports.player = async id => await Player.findOne({ _id: id }).populate('team_id');