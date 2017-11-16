const mongoose = require('mongoose');
const moment = require('moment');
const activityService = require('./activityService');
const nbaService = require('./nbaService');

const Roster = mongoose.model('Roster');
const Draft = mongoose.model('Draft');
const Activity = mongoose.model('Activity');

exports.getRosters = async league => Promise.all(league.members.map(user => this.getRoster(league, user)));

exports.getRoster = async (league, user) => {
  const roster = await Roster.find({ user, league })
    .sort({ effective: -1 })
    .limit(1)
    .populate('user')
    .populate('league')
    .populate('players');
  return roster.length ? roster[0] : { league: league, user, players: [] };
};

exports.getDraft = async (league, user) => {
  const draft = await Draft.find({ league, user })
    .populate('league')
    .populate('players')
    .populate('user');
  return draft.length ? draft[0] : new Draft({ league, user, players: [] });
};

exports.playerIsAvailable = (lists, player) => !lists.some(list => {
  if (!list || !list.players) return false;
  return list.players.some(p => p.equals(player));
});

exports.addToRoster = async (league, user, player, rosters = null, verb = 'picked up') => {
  if (!rosters) rosters = await this.getRosters(league);
  if (!player._id) player = await nbaService.player(player);
  let roster = rosters.find(roster => roster.user && roster.user.equals(user));
  if (!roster) roster = { user, league, players: [] };
  const checkAgainst = league.uniqueRosters ? rosters : [roster];
  if (!this.playerIsAvailable(checkAgainst, player)) throw new Error('Player is taken');
  if (roster.players.length >= league.rosterSize) throw new Error('Roster full');
  roster.players.push(player);
  const update = await (new Roster({ user: roster.user, league: roster.league, players: roster.players })).save();
  if (!update) throw new Error('Unable to add player');
  const action = await activityService.addAction({ user, league, category: 'rosters', message: `${verb} ${player.name}` });
  if (!action) throw new Error('Unable to add action');
};

exports.removeFromRoster = async (league, user, player, rosters = null, verb = 'dropped') => {
  if (!rosters) rosters = await this.getRosters(league);
  if (!player._id) player = await nbaService.player(player);
  let roster = rosters.find(roster => roster.user && roster.user.equals(user));
  if (!roster) roster = { user, league, players: [] };
  roster.players = roster.players.filter(p => !p.equals(player));
  const update = await (new Roster({ user: roster.user, league: roster.league, players: roster.players })).save();
  if (!update) throw new Error('Unable to remove player');
  const action = await activityService.addAction({ user, league, category: 'rosters', message: `${verb} ${player.name}` });
  if (!action) throw new Error('Unable to add action');
};