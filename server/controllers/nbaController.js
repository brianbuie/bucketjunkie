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

exports.team = async (req, res) => {
  const playersPromise = Player.find({ team: req.params.id });
  const teamPromise = Team.findOne({ _id: req.params.id });
  const [playersRaw, team] = await Promise.all([playersPromise, teamPromise]);
  let players = await Promise.all(playersRaw.map(player => Player.getAverages(player._id)));
  players = players.map(player => player[0]);
  if (req.league) {
    players = players.map(player => {
      const categories = ['ftm', 'fg2m', 'fg3m', 'reb', 'ast', 'blk', 'stl', 'to'];
      player.score = categories.reduce((sum, stat) => sum + (player.averages[stat] * req.league.pointValues[stat]), 0);
      return player;
    });
    players.sort((a,b) => {
      if (a.score < b.score) return 1;
      if (a.score > b.score) return -1;
      return 0;
    });
  }
  if (players && team) return res.render('nba/team', { title: team.full_name, players, team });
  res.flash('error', 'error fetching team info');
  return res.redirect('/');
};

exports.topPlayers = async (req, res) => {
  const allPlayers = await Player.find({});
  let players = await Promise.all(allPlayers.map(player => Player.getAverages(player._id)));
  players = players.map(player => player[0]);
  if (req.league) {
    players = players.map(player => {
      const categories = ['ftm', 'fg2m', 'fg3m', 'reb', 'ast', 'blk', 'stl', 'to'];
      player.score = categories.reduce((sum, stat) => sum + (player.averages[stat] * req.league.pointValues[stat]), 0);
      return player;
    });
    players.sort((a,b) => {
      if (a.score < b.score) return 1;
      if (a.score > b.score) return -1;
      return 0;
    });
  }
  players.splice(50);
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