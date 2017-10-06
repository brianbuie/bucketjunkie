const mongoose = require('mongoose');
const moment = require('moment');
const rosterService = require('../services/rosterService');
const activityService = require('../services/activityService');
const nbaService = require('../services/nbaService');

const Roster = mongoose.model('Roster');
const League = mongoose.model('League');

const playerIsAvailable = (rosters, playerId) => !rosters.some(roster => {
  if (!roster.players) return false;
  return roster.players.some(player => player._id == playerId);
});

const userRosterForEdit = async req => {
  const roster = req.rosters.find(roster => roster.user.equals(req.user._id));
  if (!roster) return await (new Roster({ league: req.league._id, user: req.user._id }).save());
  if (moment(roster.effective).isAfter()) return roster;
  console.log('Need to copy roster');
  return await (new Roster({ league: req.league._id, user: req.user._id, players: roster.players }).save());
};

exports.setRosters = async (req, res, next) => {
  req.rosters = await rosterService.getRosters(req.league);
  return next();
};

exports.addPlayer = async (req, res, next) => {
  if (!req.body.player) throw Error('No Player specified');
  if (!playerIsAvailable(req.rosters, req.body.player)) {
    req.flash('error', 'That player isn\'t available');
    return res.redirect('back');
  }
  const roster = await userRosterForEdit(req);
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
