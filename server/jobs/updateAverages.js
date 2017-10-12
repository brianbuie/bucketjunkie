const mongoose = require('mongoose');
const schedule = require('node-schedule');

const Player = mongoose.model('Player');

exports.init = async () => {
  console.log('Updating player averages');
  const allPlayers = await Player.find({});
  let players = await Promise.all(allPlayers.map(player => Player.getAverages(player._id)));
  players = players.map(player => player[0]);
  let updatedPlayers = await Promise.all(players.map(player => {
    const categories = ['ftm', 'fg2m', 'fg3m', 'reb', 'ast', 'blk', 'stl', 'to'];
    const update = {};
    categories.forEach(cat => update[`averages.${cat}`] = player.averages[cat]);
    return Player.findOneAndUpdate({ _id: player._id }, update, { new: true });
  }));
};