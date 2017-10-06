const mongoose = require('mongoose');
const moment = require('moment');
const rosterService = require('../services/rosterService');
const activityService = require('../services/activityService');
const nbaService = require('../services/nbaService');

const Roster = mongoose.model('Roster');
const League = mongoose.model('League');

exports.leagueRosters = async (req, res, next) => {
  req.rosters = await rosterService.getRosters(req.league);
  return next();
};

exports.userRoster = async (req, res, next) => {
  req.roster = await rosterService.getRosters(req.league, req.user);
  return next();
};

exports.viewRoster = (req, res) => res.render('roster/roster', { title: 'Roster' });

exports.addPlayer = async (req, res, next) => {
  if (!req.body.player) throw Error('No Player specified');
  if (!rosterService.playerIsAvailable(req.rosters, req.body.player)) return req.oops('That player isn\'t available');
  const current = req.rosters.find(roster => roster.user && roster.user.equals(req.user._id));
  const roster = await rosterService.rosterToEdit(req.user, req.league, current);
  const [update, player] = await Promise.all([
    Roster.findOneAndUpdate({ _id: roster._id }, { $addToSet: { players: req.body.player } }),
    nbaService.player(req.body.player)
  ]);
  if (!update) return req.oops('Unable to add player');
  req.actions = [{ category: 'roster', message: `drafted ${player.player_name} of the ${player.team_id.full_name}` }];
  await activityService.addActivity(req);
  return req.greatJob('Added player', `/lg/${req.league._id}`);
};

exports.removePlayer = async (req, res, next) => {
  if (!req.body.player) throw Error('No Player specified');
  const roster = await rosterService.rosterToEdit(req.user, req.league, req.roster);
  const [update, player] = await Promise.all([
    Roster.findOneAndUpdate({ _id: roster._id }, { $pull: { players: req.body.player } }),
    nbaService.player(req.body.player)
  ]);
  if (!update) return req.oops('Unable to remove player');
  req.actions = [{ category: 'roster', message: `dropped ${player.player_name}` }];
  await activityService.addActivity(req);
  return req.greatJob('Removed player', `/lg/${req.league._id}`);
};
