const mongoose = require('mongoose');
const moment = require('moment');
const nbaService = require('../services/nbaService');

const Player = mongoose.model('Player');

exports.update = async () => {
  let start = Date.now();
  const allPlayers = await nbaService.fetchAllPlayers();
  const updatedPlayers = await Promise.all(allPlayers
    .filter(player => !!player.team)
    .map(player => Player.findOneAndUpdate({ _id: player.id }, player, { upsert: true, new: true }))
  );
  console.log(`${moment().format()}: Updated player info in ${Date.now() - start}ms`);
};