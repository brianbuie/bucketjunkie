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
      player = player.toObject();
      const categories = ['ftm', 'fg2m', 'fg3m', 'reb', 'ast', 'blk', 'stl', 'to'];
      player.score = categories.reduce((sum, stat) => sum + (player.averages[stat] * league.pointValues[stat]), 0);
      return player;
    });
  }
  console.log(players);
  if (players && team) return res.render('nba/team', { title: team.full_name, players, team });
  res.flash('error', 'error fetching team info');
  return res.redirect('/');
};

exports.player = async (req, res) => {
  const player = await Player.findOne({ _id: req.params.id }).populate('team');
  if (!player) {
    res.flash('error', 'error fetching player info');
    return res.redirect('/');
  }
  return res.render('nba/player', { title: player.name, player });
};