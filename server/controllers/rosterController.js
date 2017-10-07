const mongoose = require('mongoose');
const moment = require('moment');
const rosterService = require('../services/rosterService');
const activityService = require('../services/activityService');
const nbaService = require('../services/nbaService');

const Roster = mongoose.model('Roster');
const League = mongoose.model('League');

const playerIsAvailable = (rosters, playerId) => !rosters.some(roster => {
  if (!roster || !roster.players) return false;
  return roster.players.some(player => player._id == playerId);
});

exports.viewRoster = async (req, res) => {
  const roster = await rosterService.getRoster(req.league, req.user);
  return res.render('roster/roster', { title: 'Roster', roster });
};

exports.addPlayer = async (req, res, next) => {
  if (!req.body.player) return req.oops('No player specified');
  const leagueRosters = await rosterService.getRosters(req.league);
  let roster = leagueRosters.find(roster => roster.user && roster.user.equals(req.user._id));
  if (!roster) roster = { players: [] };
  if (roster.players.length >= req.league.rosterSize) return req.oops('Your roster is full', '/roster');
  const checkAgainst = req.league.uniqueRosters ? leagueRosters : [roster];
  if (!playerIsAvailable(checkAgainst, req.body.player)) return req.oops('That player isn\'t available');
  roster.players.push(req.body.player);
  const [update, player] = await Promise.all([
    (new Roster({ league: req.league, user: req.user, players: roster.players })).save(),
    nbaService.player(req.body.player)
  ]);
  if (!update) return req.oops('Unable to add player');
  req.actions = [{ category: 'roster', message: `picked up ${player.player_name} of the ${player.team_id.full_name}` }];
  await activityService.addActivity(req);
  return req.greatJob('Added player', `/lg/${req.league._id}`);
};

exports.removePlayer = async (req, res, next) => {
  if (!req.body.player) return req.oops('No player specified');
  let roster = await rosterService.getRoster(req.league, req.user);
  if (!roster) return req.oops('Couldn\'t find roster')
  roster.players = roster.players.filter(player => player._id != req.body.player);
  const [update, player] = await Promise.all([
    (new Roster({ league: req.league, user: req.user, players: roster.players })).save(),
    nbaService.player(req.body.player)
  ]);
  if (!update) return req.oops('Unable to remove player');
  req.actions = [{ category: 'roster', message: `dropped ${player.player_name}` }];
  await activityService.addActivity(req);
  return req.greatJob('Removed player', `/lg/${req.league._id}`);
};
