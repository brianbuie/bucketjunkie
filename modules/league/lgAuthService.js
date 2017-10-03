const mongoose = require('mongoose');

const League = mongoose.model('League');

exports.setLeague = async (req, res, next) => {
  console.log('setLeague called');
  const league = await League.findOne({ _id: req.params.id })
    .populate('members')
    .populate('moderators')
    .populate('creator');
  if (!league) throw Error('No League');
  req.league = league;
  return next();
};

exports.setPermissions = (req, res, next) => {
  console.log('setPermissions called');
  req.leagueAuth = {
    isModerator: false,
    isMember: false,
    isCreator: false,
  };
  if (req.user) {
    req.leagueAuth.isModerator = req.league.moderators.some(mod => mod._id.equals(req.user._id));
    req.leagueAuth.isMember = req.league.members.some(member => member._id.equals(req.user._id));
    req.leagueAuth.isCreator = req.league.creator.equals(req.user._id);
  }
  if (req.leagueAuth.isMember) req.session.league = req.league;
  return next();
};

exports.isMember = (req, res, next) => {
  console.log('isMember called');
  if (!req.leagueAuth.isMember) {
    req.flash('error', 'You must be a member to do that');
    return res.redirect('back');
  }
  return next();
};

exports.isModerator = (req, res, next) => {
  console.log('isModerator called');
  if (!req.leagueAuth.isModerator) {
    req.flash('error', 'You must be a moderator to do that');
    return res.redirect('back');
  }
  return next();
};

exports.isCreator = (req, res, next) => {
  console.log('isCreator called');
  if (!req.leagueAuth.isCreator) {
    req.flash('error', 'You must be the league creator to do that');
    return es.redirect('back');
  }
  return next();
};

exports.notCreator = (req, res, next) => {
  console.log('notCreator called');
  if (req.leagueAuth.isCreator) {
    req.flash('error', 'League creators can\'t do that!');
    return res.redirect('back');
  }
  return next();
}