const mongoose = require('mongoose');
const moment = require('moment');

const Roster = mongoose.model('Roster');

exports.getRosters = async (league, user = null) => {
  if (!user) return Promise.all(league.members.map(user => this.getRoster(league, user)));
  return this.getRoster(league, user);
};

exports.getRoster = async (league, user) => {
  const roster = await Roster.find({ user, league })
    .sort({ effective: -1 })
    .limit(1)
    .populate('user')
    .populate('players');
  return roster.length ? roster[0] : roster;
}

exports.playerIsAvailable = (rosters, playerId) => !rosters.some(roster => {
  if (!roster || !roster.players) return false;
  return roster.players.some(player => player._id == playerId);
});

exports.rosterToEdit = async (user, league, roster) => {
  if (!roster) return await (new Roster({ league, user }).save());
  if (moment(roster.effective).isAfter()) return roster;
  return await (new Roster({ league, user, players: roster.players }).save());
};