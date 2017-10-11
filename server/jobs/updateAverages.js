const mongoose = require('mongoose');
const schedule = require('node-schedule');

const Player = mongoose.model('Player');

exports.init = async () => {
  console.log('UPDATING AVERAGES');

  console.log('getting players');
  const allPlayers = await Player.find({});

  console.log('getting averages');
  let players = await Promise.all(allPlayers.map(player => Player.getAverages(player._id)));
  players = players.map(player => player[0]);

  console.log('updating players');
  let updatedPlayers = await Promise.all(players.map(player => {
    const categories = ['ftm', 'fg2m', 'fg3m', 'reb', 'ast', 'blk', 'stl', 'to'];
    const update = {};
    categories.forEach(cat => update[`averages.${cat}`] = player.averages[cat]);
    return Player.findOneAndUpdate({ _id: player._id }, update, { new: true });
  }));
  
  console.log('finished updating averages');
};