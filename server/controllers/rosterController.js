const mongoose = require('mongoose');
const moment = require('moment');
const rosterService = require('../services/rosterService');
const activityService = require('../services/activityService');
const nbaService = require('../services/nbaService');

const Roster = mongoose.model('Roster');
const Draft = mongoose.model('Draft');

const addToDraft = async (req, res) => {
  let draft = await Draft.update({ user: req.user, league: req.league }, 
    { $addToSet: { players: req.body.player } },
    { upsert: true }
  );
  if (!draft.ok) return req.oops('Error adding player');
  return req.greatJob('Added player');
};

exports.addPlayer = async (req, res) => {
  if (!req.body.player) return req.oops('No player specified');
  if (req.league.drafting) return addToDraft(req, res);
  try {
    await rosterService.addToRoster(req.league, req.user, req.body.player);
  } catch(err) {
    if (err.message === "Roster full") return req.oops('Roster full, drop a player and try again');
    return req.oops(err.message);
  }
  return req.greatJob('Added Player');
};

const removeFromDraft = async (req, res) => {
  let draft = await Draft.update({ user: req.user, league: req.league }, 
    { $pull: { players: req.body.player } }
  );
  if (!draft.ok) return req.oops('Error removing player');
  return req.greatJob('Removed Player');
};

exports.removePlayer = async (req, res) => {
  if (!req.body.player) return req.oops('No player specified');
  if (req.league.drafting) return removeFromDraft(req, res);
  try {
    await rosterService.removeFromRoster(req.league, req.user, req.body.player);
  } catch(err) {
    return req.oops(err.message);
  }
  return req.greatJob('Removed player');
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

