const mongoose = require('mongoose');
const moment = require('moment');
const rosterService = require('../services/rosterService');
const activityService = require('../services/activityService');
const nbaService = require('../services/nbaService');

const Roster = mongoose.model('Roster');
const Draft = mongoose.model('Draft');

const playerIsAvailable = (lists, playerId) => !lists.some(list => {
  if (!list || !list.players) return false;
  return list.players.some(player => player._id == playerId);
});

exports.viewRoster = async (req, res) => {
  if (req.league.drafting) {
    const draft = await Draft.findOne({ user: req.user, league: req.league }).populate('players');
    return res.render('roster/draft-list', { title: 'Draft List', draft });
  }
  const roster = await rosterService.getRoster(req.league, req.user);
  return res.render('roster/roster', { title: 'Roster', roster });
};

const addToDraft = async (req, res) => {
  let draft = await Draft.update({ user: req.user, league: req.league }, 
    { $addToSet: { players: req.body.player } },
    { upsert: true }
  );
  if (!draft.ok) return req.oops('Error adding player');
  return res.redirect('/roster');
};

exports.addPlayer = async (req, res) => {
  if (!req.body.player) return req.oops('No player specified');
  if (req.league.drafting) return addToDraft(req, res);
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

const removeFromDraft = async (req, res) => {
  let draft = await Draft.update({ user: req.user, league: req.league }, 
    { $pull: { players: req.body.player } }
  );
  if (!draft.ok) return req.oops('Error removing player');
  return res.redirect('/roster');
};

exports.removePlayer = async (req, res) => {
  if (!req.body.player) return req.oops('No player specified');
  if (req.league.drafting) return removeFromDraft(req, res);
  let roster = await rosterService.getRoster(req.league, req.user);
  if (!roster) return req.oops('Couldn\'t find roster');
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
  if (req.league.drafting) return req.oops('League is still drafting');
  if (!req.query.player) return req.oops('No player specified', `/lg/${req.league._id}`);
  const [roster, player] = await Promise.all([
    rosterService.getRoster(req.league, req.user),
    nbaService.player(req.query.player)
  ]);
  return res.render('roster/replace', { title: 'Replace Player', roster, player });
};

exports.replacePlayer = async (req, res) => {
  if (req.league.drafting) return req.oops('League is still drafting');
  if (!req.query.player) return req.oops('No player specified to add', `/lg/${req.league._id}`);
  if (!req.body.player) return req.oops('No player specified to drop', `/lg/${req.league._id}`);
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
};

exports.moveDraft = async (req, res) => {
  if (!req.league.drafting) return req.oops('League has already drafted.');
  if (!req.body.player) return req.oops('No player specified to move up');
  if (!req.body.delta) return req.oops('No direction specified');
  const draft = await Draft.findOne({ user: req.user, league: req.league });
  const playerIndex = draft.players.indexOf(req.body.player);
  draft.players.splice(playerIndex, 1);
  draft.players.splice(playerIndex + parseInt(req.body.delta), 0, req.body.player);
  await draft.save();
  return req.greatJob('Player moved');
};
