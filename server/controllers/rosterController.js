const mongoose = require('mongoose');
const moment = require('moment');

const Roster = mongoose.model('Roster');
const League = mongoose.model('League');

exports.getLeague = async (req, res, next) => {
  const sessionLeague = req.session.league;
  const league = await League.findOne({ _id: req.session.league._id, members: req.user._id })
    .populate('members');
  if (!league) {
    req.flash('error', 'Error getting league info.');
    res.redirect('/leagues');
  }
  req.league = league;
  req.session.league = league;
  return next();
};

exports.getRosters = async (req, res, next) => {
  const myPromise = Roster.find({ user: req.user._id, league: req.league._id })
    .sort({ effective: -1 })
    .limit(1);
  const opponents = req.league.members.filter(member => !member._id.equals(req.user._id));
  const theirPromises = opponents.map(member => Roster.find({ user: member._id, league: req.league._id })
    .sort({ effective: -1 })
    .limit(1)
  );
  const [myRoster, theirRosters] = await Promise.all([myPromise, Promise.all(theirPromises)]);
  req.rosters = {};
  req.rosters.mine = myRoster.length ? myRoster[0] : {};
  req.rosters.theirs = theirRosters.map(roster => roster.length ? roster : {});
  req.session.rosters = req.rosters;
  return next();
};

exports.addPlayer = async (req, res, next) => {
  console.log(moment().add(1, 'days').startOf('day'));
  const existingRoster = await Roster.find({ user: req.user._id, league: req.league._id })
    .sort({ effective: -1 })
    .limit(1);
  if (!existingRoster.length) {
    console.log('no existing roster');
    const roster = await (new Roster({
      league: req.league._id,
      user: req.user._id,
    })).save();
    roster.players.push(req.body.player);
    await roster.save();
  } else {
    if (moment(existingRoster[0].effective).isBefore('now')) {
      const roster = await (new Roster({
        league: req.league._id,
        user: req.user._id,
      })).save();
      roster.players.push(req.body.player);
      await roster.save();
    }
  }
  return res.redirect('/roster');
}

exports.displayRoster = (req, res) => res.render('roster/roster', { title: 'Roster' });