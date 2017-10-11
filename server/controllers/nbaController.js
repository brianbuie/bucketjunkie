const mongoose = require('mongoose');
const fs = require('fs');

const Team = mongoose.model('Team');
const Player = mongoose.model('Player');

exports.allTeams = async (req, res) => {
  const teams = await Team.find();
  if (teams) return res.render('nba/allTeams', { title: 'Teams', teams });
  res.flash('error', 'error fetching teams');
  return res.redirect('/');
};

const sortPlayers = (playersToSort, pointValues = null) => {
  if (!pointValues) {
    pointValues = { ftm: 1, fg2m: 2, fg3m: 3, reb: 1, ast: 1, blk: 1, stl: 1, to: -1 };
  }
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

exports.team = async (req, res) => {
  const playersPromise = Player.find({ team: req.params.id });
  const teamPromise = Team.findOne({ _id: req.params.id });
  const [allPlayers, team] = await Promise.all([playersPromise, teamPromise]);
  if (req.league) {
    const players = sortPlayers(allPlayers, req.league.pointValues);
  } else {
    const players = sortPlayers(allPlayers);
  }
  if (players && team) return res.render('nba/topPlayers', { title: team.full_name, players, team });
  res.flash('error', 'error fetching team info');
  return res.redirect('/');
};

exports.topPlayers = async (req, res) => {
  let allPlayers = await Player.find({});
  if (req.league) {
    const players = sortPlayers(allPlayers, req.league.pointValues);
  } else {
    const players = sortPlayers(allPlayers);
  }
  return res.render('nba/topPlayers', { title: 'Top Players', players });
}

exports.player = async (req, res) => {
  const player = await Player.findOne({ _id: req.params.id }).populate('team');
  if (!player) {
    res.flash('error', 'error fetching player info');
    return res.redirect('/');
  }
  return res.render('nba/player', { title: player.name, player });
};