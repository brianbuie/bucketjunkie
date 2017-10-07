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

exports.addPlayer = async (req, res) => {
  if (!req.body.player) return req.oops('No player specified');
  const leagueRosters = await rosterService.getRosters(req.league);
  let roster = leagueRosters.find(roster => roster.user && roster.user.equals(req.user._id));
  if (!roster) roster = { players: [] };
  if (roster.players.length >= req.league.rosterSize) return res.redirect(`/roster/replace?player=${req.body.player}`);
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

exports.removePlayer = async (req, res) => {
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

exports.replacePlayerForm = async (req, res) => {
  if (!req.query.player) return req.oops('No player specified', `/lg/${req.league._id}`);
  const [roster, player] = await Promise.all([
    rosterService.getRoster(req.league, req.user),
    nbaService.player(req.query.player)
  ]);
  return res.render('roster/replace', { title: 'Replace Player', roster, player });
};

exports.replacePlayer = async (req, res) => {
  if (!req.query.player) return req.oops('No player specified to add', `/lg/${req.league._id}`);
  if (!req.body.player) return req.oops('No player specified to drop', `/lg/${req.league._id}`)
  const leagueRosters = await rosterService.getRosters(req.league);
  let roster = leagueRosters.find(roster => roster.user && roster.user.equals(req.user._id));
  const checkAgainst = req.league.uniqueRosters ? leagueRosters : [roster];
  if (!playerIsAvailable(checkAgainst, req.query.player)) return req.oops('That player isn\'t available', `/lg/${req.league._id}`);
  roster.players = roster.players.filter(player => player._id != req.body.player);
  roster.players.push(req.query.player);
  const [update, playerAdded, playerDropped] = await Promise.all([
    (new Roster({ league: req.league, user: req.user, players: roster.players })).save(),
    nbaService.player(req.query.player),
    nbaService.player(req.body.player)
  ]);
  if (!update) return req.oops('Unable to swap player');
  req.actions = [
    { category: 'roster', message: `dropped ${playerDropped.player_name}` },
    { category: 'roster', message: `picked up ${playerAdded.player_name}` }
  ];
  await activityService.addActivity(req);
  return req.greatJob('Replaced player', `/lg/${req.league._id}`);
}
