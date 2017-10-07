const mongoose = require('mongoose');
const moment = require('moment');

const Roster = mongoose.model('Roster');

exports.getRosters = async league => Promise.all(league.members.map(user => this.getRoster(league, user)));

exports.getRoster = async (league, user) => {
  const roster = await Roster.find({ user, league })
    .sort({ effective: -1 })
    .limit(1)
    .populate('user')
    .populate('players');
  return roster.length ? roster[0] : roster;
};