const mongoose = require('mongoose');
const fs = require('fs');

const Team = mongoose.model('Team');
const Player = mongoose.model('Player');

const sortPlayers = (playersToSort, req) => {
  let pointValues = { ftm: 1, fg2m: 2, fg3m: 3, reb: 1, ast: 1, blk: 1, stl: 1, to: -1 };
  if (req.league) pointValues = req.league.pointValues;
  players = playersToSort.map(player => {
    const categories = ['ftm', 'fg2m', 'fg3m', 'reb', 'ast', 'blk', 'stl', 'to'];
    player.score = categories.reduce((sum, stat) => sum + (player.averages[stat] * pointValues[stat]), 0);
    return player;
  });
  players.sort((a,b) => {
    if (a.score < b.score) return 1;
    if (a.score > b.score) return -1;
    return 0;
  });
  return players;
};

exports.players = async (req, res) => {
  const findQ = {};
  if (req.query.team) findQ.team = req.query.team;
  const [players, teams] = await Promise.all([
    Player.find(findQ),
    Team.find({})
  ]);
  const sortedPlayers = sortPlayers(players, req);
  return res.render('nba/topPlayers', { title: 'Top Players', players: sortedPlayers, teams, activeTeam: req.query.team });
};