const mongoose = require('mongoose');
const moment = require('moment');

const Roster = mongoose.model('Roster');

exports.getRosters = async league => Promise.all(league.members.map(user => this.getRoster(user, league)));

exports.getRoster = async (user, league) => {
  const roster = await Roster.find({ user, league })
    .sort({ effective: -1 })
    .limit(1)
    .populate('user')
    .populate('players');
  return roster.length ? roster[0] : roster;
}

exports.playerIsAvailable = (rosters, playerId) => !rosters.some(roster => {
  if (!roster.players) return false;
  return roster.players.some(player => player._id == playerId);
});

exports.rosterToEdit = async req => {
  const roster = req.rosters.find(roster => roster.user && roster.user.equals(req.user._id));
  if (!roster) return await (new Roster({ league: req.league._id, user: req.user._id }).save());
  if (moment(roster.effective).isAfter()) return roster;
  console.log('Need to copy roster');
  return await (new Roster({ league: req.league._id, user: req.user._id, players: roster.players }).save());
};