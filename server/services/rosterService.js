const mongoose = require('mongoose');
const moment = require('moment');
const suffix = require('ordinal-number-suffix');
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
    .populate('players');
  return roster.length ? roster[0] : roster;
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
  if (roster.players.length >= league.rosterSize) throw new Error('Roster Full');
  const checkAgainst = league.uniqueRosters ? rosters : [roster];
  if (!this.playerIsAvailable(checkAgainst, player)) throw new Error('Player is taken');
  roster.players.push(player);
  const update = await (new Roster({ user: roster.user, league: roster.league, players: roster.players })).save();
  if (!update) throw new Error('Unable to add player');
  const action = await activityService.addAction({ user, league, category: 'roster', message: `${verb} ${player.name}` });
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
  const action = await activityService.addAction({ user, league, category: 'roster', message: `${verb} ${player.name}` });
  if (!action) throw new Error('Unable to add action');
};

exports.autoDraft = async league => {
  console.log(`Autodraft for ${league.id}`);
  const drafts = await Draft.find({ league }).populate('players').populate('user');
  const rosters = league.members.map(user => { return { league, user, players: [] } });
  const actions = [];
  let round = 0, pick = 0;
  const simRound = user => {
    pick++;
    if (round > league.rosterSize) return;
    let action = { user, league, category: 'roster' };
    let rosterIndex = rosters.findIndex(roster => roster.user.equals(user));
    let draft = drafts.find(draft => draft.user.equals(user));
    if (!draft) draft = { players: [] };
    let player = draft.players.find(player => this.playerIsAvailable(rosters, player));
    if (!player) {
      action.message = `forfeited the ${suffix(pick)} pick of round ${round}`;
      return actions.push(action);
    }
    rosters[rosterIndex].players.push(player);
    action.message = `drafted ${player.name} with the ${suffix(pick)} pick of round ${round}`;
    return actions.push(action);
  };
  while (round < league.rosterSize) {
    round++;
    league.members.forEach(user => simRound(user)); pick = 0; round++;
    league.members.reverse().forEach(user => simRound(user)); pick = 0;
  }
  const update = await Promise.all(rosters.map(roster => (new Roster(roster)).save()));
  console.log(update);
  const addActions = await Activity.insertMany(actions, { ordered: true });
  // TODO HANDLE ERRORS HERE
};