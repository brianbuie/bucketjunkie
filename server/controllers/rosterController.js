const mongoose = require('mongoose');
const moment = require('moment');
const rosterService = require('../services/rosterService');
const activityService = require('../services/activityService');
const nbaService = require('../services/nbaService');

const Roster = mongoose.model('Roster');
const Draft = mongoose.model('Draft');

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
  try {
    await rosterService.addToRoster(req.league, req.user, req.body.player);
  } catch(err) {
    if (err.message === "Roster Full") return req.oops(err.message, `/roster/replace?player=${req.body.player}`);
    return req.oops(err.message);
  }
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
  try {
    await rosterService.removeFromRoster(req.league, req.user, req.body.player);
  } catch(err) {
    return req.oops(err.message);
  }
  return req.greatJob('Removed player', `/roster`);
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
  try {
    await rosterService.removeFromRoster(req.league, req.user, req.body.player);
    await rosterService.addToRoster(req.league, req.user, req.query.player);
  } catch(err) {
    return req.oops(err.message);
  }
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

