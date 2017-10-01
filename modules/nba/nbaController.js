const mongoose = require('mongoose');

const Team = mongoose.model('Team');
const Player = mongoose.model('Player');

exports.allTeams = async (req, res) => {
  const teams = await Team.find();
  if (teams) return res.render('nba/allTeams', { title: 'Teams', teams });
  res.flash('error', 'error fetching teams');
  return res.redirect('/');
};

exports.team = async (req, res) => {
  const playersPromise = Player.find({ team_id: req.params.id });
  const teamPromise = Team.findOne({ _id: req.params.id });
  const [players, team] = await Promise.all([playersPromise, teamPromise]);
  if (players && team) return res.render('nba/team', { title: `${team.city} ${team.team_name}`, players, team });
  res.flash('error', 'error fetching team info');
  return res.redirect('/');
};

exports.player = async (req, res) => {
  const player = await Player.findOne({ _id: req.params.id }).populate('team_id');
  if (player) return res.render('nba/player', { title: player.player_name, player });
  res.flash('error', 'error fetching player info');
  return res.redirect('/');
}