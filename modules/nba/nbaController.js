const mongoose = require('mongoose');
const fs = require('fs');

const Team = mongoose.model('Team');
const Player = mongoose.model('Player');
const Game = mongoose.model('Game');

exports.allTeams = async (req, res) => {
  const teams = await Team.find();
  if (teams) return res.render('nba/allTeams', { title: 'Teams', teams });
  res.flash('error', 'error fetching teams');
  return res.redirect('/');
};

exports.team = async (req, res) => {
  const playersPromise = Player.find({ team_id: req.params.id });
  const teamPromise = Team.findOne({ _id: req.params.id });
  const gamesPromise = Game
    .find({ 
      $or: [{ home_id: req.params.id }, { away_id: req.params.id }], 
      date: { $gt: new Date() },
      final: false
    })
    .limit(10)
    .populate('home_id')
    .populate('away_id');
  const [players, team, games] = await Promise.all([playersPromise, teamPromise, gamesPromise]);
  if (players && team && games) return res.render('nba/team', { title: team.full_name, players, team, games });
  res.flash('error', 'error fetching team info');
  return res.redirect('/');
};

exports.player = async (req, res) => {
  const player = await Player.findOne({ _id: req.params.id }).populate('team_id');
  if (!player) {
    res.flash('error', 'error fetching player info');
    return res.redirect('/');
  }
  return res.render('nba/player', { title: player.player_name, player });
};