const mongoose = require('mongoose');
const moment = require('moment');

const Roster = mongoose.model('Roster');

exports.getRosters = async league => {
  const rawRosters = await Promise.all(league.members.map(user => Roster.find({ user, league })
    .sort({ effective: -1 })
    .limit(1)
    .populate('user')
  ));
  return rawRosters.map(roster => roster.length ? roster[0] : roster);
};