const mongoose = require('mongoose');
const moment = require('moment');
const rosterService = require('../services/rosterService');
const nbaService = require('../services/nbaService');

const Roster = mongoose.model('Roster');
const Draft = mongoose.model('Draft');

const addToDraft = async (req, res) => {
  let draft = await rosterService.getDraft(req.league, req.user);
  draft.players.addToSet(req.body.player);
  await draft.save();
  return res.greatJob('Added player');
};

const removeFromDraft = async (req, res) => {
  let draft = await rosterService.getDraft(req.league, req.user);
  draft.players.pull(req.body.player);
  await draft.save();
  return res.greatJob('Removed Player');
};

exports.addPlayer = async (req, res) => {
  if (!req.body.player) return res.oops('No player specified');
  if (req.league.drafting) return addToDraft(req, res);
  try {
    await rosterService.addToRoster(req.league, req.user, req.body.player);
  } catch(err) {
    if (err.message === "Roster full") return res.oops('Roster full, drop a player and try again');
    return res.oops(err.message);
  }
  return res.greatJob('Added Player');
};

exports.removePlayer = async (req, res) => {
  if (!req.body.player) return res.oops('No player specified');
  if (req.league.drafting) return removeFromDraft(req, res);
  try {
    await rosterService.removeFromRoster(req.league, req.user, req.body.player);
  } catch(err) {
    return res.oops(err.message);
  }
  return res.greatJob('Removed player');
};

exports.moveDraft = async (req, res) => {
  const draft = await rosterService.getDraft(req.league, req.user);
  const playerIndex = draft.players.map(player => player._id).indexOf(req.body.player);
  draft.players.splice(playerIndex, 1);
  draft.players.splice(playerIndex + parseInt(req.body.delta), 0, req.body.player);
  await draft.save();
  return res.greatJob('Player moved');
};

