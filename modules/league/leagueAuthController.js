const mongoose = require('mongoose');
const activity = require('../activity/activityController');

const League = mongoose.model('League');
const User = mongoose.model('User');

exports.setLeague = async (req, res, next, id) => {
  if (!req.params.id) {
    req.flash('error', 'No League specified');
    return res.redirect('/leagues');
  }
  const league = await League.findOne({ _id: req.params.id })
    .populate('members')
    .populate('moderators')
    .populate('creator');
  if (!league) {
    req.flash('error', 'Unable to get League Info');
    return res.redirect('/leagues');
  }
  req.league = league;
  return next();
};

exports.setPermissions = (req, res, next) => {
  if (!req.league) {
    req.flash('error', 'No league property on request');
    req.redirect('/leagues');
  }
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
  if (req.leagueAuth && !req.leagueAuth.isMember) {
    req.flash('error', 'You must be a member to do that');
    res.redirect('back');
  }
  return next();
};

exports.isModerator = (req, res, next) => {
  if (req.leagueAuth && !req.leagueAuth.isModerator) {
    req.flash('error', 'You must be a moderator to do that');
    res.redirect('back');
  }
  return next();
};

exports.isCreator = (req, res, next) => {
  if (req.leagueAuth && !req.leagueAuth.isCreator) {
    req.flash('error', 'You must be the league creator to do that');
    res.redirect('back');
  }
  return next();
};

exports.joinLeague = async (req, res) => {
  const league = await League.findOneAndUpdate(
    { _id: req.params.id, open: true },
    { $addToSet: { members: req.user.id } },
  );
  if (!league) {
    req.flash('error', 'Unable to join league');
    return res.redirect('/leagues');
  }
  req.league = league;
  req.activity = { category: 'league', message: `joined '${league.name}'` };
  await activity.addActivity(req, res);
  return res.redirect(`/lg/${league._id}`);
};

exports.confirmLeaveLeague = (req, res) => res.render('league/leaveLeague', { title: 'Leave League', league: req.league });

exports.leaveLeague = async (req, res) => {
  if (req.leagueAuth && req.leagueAuth.isCreator) {
    req.flash('error', 'Sorry, you can\'t leave a league you created. It would be chaos!');
    return res.redirect(`/lg/${req.league._id}`);
  }
  const league = await League.findOneAndUpdate(
    { creator: { $ne: req.user._id }, members: req.user._id }, 
    { $pull: { members: req.user._id, moderators: req.user._id } }, 
    { new: true }
  );
  if (!league) {
    req.flash('error', 'Error Leaving league');
    return res.redirect(`/lg/${req.params.id}`);
  }
  req.session.league = undefined;
  req.activity = { category: 'league', message: `left '${league.name}'` };
  await activity.addActivity(req, res);
  req.flash('success', `Left '${league.name}'`);
  res.redirect('/leagues');
};

exports.removeMember = async (req, res) => {
  const league = await League.findOneAndUpdate(
    { 
      creator: { $ne: req.body.member },
      $and: [
        { moderators: { $ne: req.body.member } },
        { moderators: req.user._id },
      ],
      members: req.body.member,
    },
    { $pull: { members: req.body.member } },
    { new: true }
  );
  if (!league) {
    req.flash('error', 'Error Removing Member');
    return res.redirect(`/lg/${req.params.id}`);
  }
  let userAffected = await User.findOne({ _id: req.body.member });
  if (!userAffected) {
    req.flash('Error getting user info');
    userAffected.username = 'UNKNOWN USER';
  }
  req.activity = { category: 'moderator', message: `removed ${userAffected.username}` };
  await activity.addActivity(req, res);
  req.activity = { user: userAffected._id, category: 'league', message: `left '${league.name}'` };
  await activity.addActivity(req, res);
  req.flash('success', 'Removed Member');
  return res.redirect(`/lg/${req.params.id}`);
};

exports.addModerator = async (req, res) => {
  const league = await League.findOneAndUpdate(
    { 
      creator: req.user._id, 
      moderators: { $ne: req.body.member }, 
      members: req.body.member,
    },
    { $addToSet: { moderators: req.body.member } },
    { new: true },
  ).populate('moderators');
  if (!league) {
    req.flash('error', 'Error Adding Moderator');
    return res.redirect(`/lg/${req.params.id}`);
  }
  let userAffected = league.moderators.find(mod => mod.id === req.body.member);
  if (!userAffected) {
    req.flash('Error getting user info');
    userAffected = { username: 'UNKNOWN USER' };
  }
  req.activity = { category: 'moderator', message: `added ${userAffected.username} as a moderator` };
  await activity.addActivity(req, res);
  req.flash('success', 'Added Moderator');
  return res.redirect(`/lg/${req.params.id}`);
};

exports.removeModerator = async (req, res) => {
  const league = await League.findOneAndUpdate(
    { 
      creator: req.user._id, 
      moderators: req.body.member,
    },
    { $pull: { moderators: req.body.member } },
    { new: true },
  );
  if (!league) {
    req.flash('error', 'Error Removing Moderator');
    return res.redirect(`/lg/${req.params.id}`);
  }
  let userAffected = await User.findOne({ _id: req.body.member });
  if (!userAffected) {
    req.flash('Error getting user info');
    userAffected = { username: 'UNKNOWN USER' };
  }
  req.activity = { category: 'moderator', message: `removed ${userAffected.username} as a moderator` };
  await activity.addActivity(req, res);
  req.flash('success', 'Removed Moderator');
  return res.redirect(`/lg/${req.params.id}`);
};