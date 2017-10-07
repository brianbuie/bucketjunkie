const mongoose = require('mongoose');

const League = mongoose.model('League');

const getLeague = async id => {
  const league = await League.findOne({ _id: id })
    .populate('members')
    .populate('moderators')
    .populate('creator');
  if (!league) throw Error('No League Found');
  return league;
};

const setPermissions = (league, user = null) => {
  let leagueAuth = {
    isModerator: false,
    isMember: false,
    isCreator: false,
  };
  if (user) {
    leagueAuth.isModerator = league.moderators.some(mod => mod._id.equals(user._id));
    leagueAuth.isMember = league.members.some(member => member._id.equals(user._id));
    leagueAuth.isCreator = league.creator.equals(user._id);
  }
  return leagueAuth;
};

exports.useParam = async (req, res, next) => {
  if (!req.params.id) return req.oops('Please specify a league');
  req.league = await getLeague(req.params.id);
  req.leagueAuth = setPermissions(req.league, req.user);
  if (req.leagueAuth.isMember) req.session.league = req.league;
  return next();
};

exports.useSession = async (req, res, next) => {
  if (!req.session.league) return req.oops('Please specify a league');
  req.league = await getLeague(req.session.league._id);
  req.leagueAuth = setPermissions(req.league, req.user);
  if (req.leagueAuth.isMember) req.session.league = req.league;
  return next();
};

exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  req.oops('You must be logged in to do that.', `/account/login?ref=${req.originalUrl}`);
};

exports.isMember = (req, res, next) => {
  if (req.leagueAuth.isMember) return next();
  req.oops('You must be a member to do that.');
};

exports.isModerator = (req, res, next) => {
  if (req.leagueAuth.isModerator) return next();
  req.oops('You must be a moderator to do that');
};

exports.isCreator = (req, res, next) => {
  if (req.leagueAuth.isCreator) return next();
  req.oops('You must be the league creator to do that');
};

exports.notCreator = (req, res, next) => {
  if (!req.leagueAuth.isCreator) return next();
  req.oops('League creators can\'t do that!');
};