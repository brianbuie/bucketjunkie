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

exports.userRoster = async (req, res) => {
  req.roster = await rosterService.getRoster(req.user, req.league);
  return res.render('roster/roster', { title: 'Roster' });
};

exports.addPlayer = async (req, res, next) => {
  if (!req.body.player) throw Error('No Player specified');
  if (!rosterService.playerIsAvailable(req.rosters, req.body.player)) {
    req.flash('error', 'That player isn\'t available');
    return res.redirect('back');
  }
  const roster = await rosterService.rosterToEdit(req);
  const [update, player] = await Promise.all([
    Roster.findOneAndUpdate({ _id: roster._id }, { $addToSet: { players: req.body.player } }),
    nbaService.player(req.body.player)
  ]);
  if (!update) {
    req.flash('error', 'Unable to add player');
    return res.redirect('back');
  }
  req.actions = [{ category: 'roster', message: `drafted ${player.player_name} of the ${player.team_id.full_name}` }];
  await activityService.addActivity(req);
  req.actions = undefined;
  req.flash('success', 'Added player');
  return res.redirect(`/lg/${req.league._id}`);
};
