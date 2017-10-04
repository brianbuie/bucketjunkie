const mongoose = require('mongoose');
const activity = require('../../activity/activityController');

const League = mongoose.model('League');
const User = mongoose.model('User');

exports.joinLeague = async (req, res) => {
  const league = await League.findOneAndUpdate(
    { _id: req.league._id, open: true },
    { $addToSet: { members: req.user.id } },
  );
  if (!league) {
    req.flash('error', 'Unable to join league');
    return res.redirect('/leagues');
  }
  req.league = league;
  req.activity = { category: 'league', message: `joined '${req.league.name}'` };
  await activity.addActivity(req, res);
  return res.redirect(`/lg/${req.league._id}`);
};

exports.confirmLeaveLeague = (req, res) => res.render('league/leaveLeague', { title: 'Leave League', league: req.league });

exports.leaveLeague = async (req, res) => {
  const league = await League.findOneAndUpdate(
    { 
      _id: req.league._id,
      creator: { $ne: req.user._id }, 
      members: req.user._id,
    }, 
    { $pull: { members: req.user._id, moderators: req.user._id, }, }, 
    { new: true },
  );
  if (!league) {
    req.flash('error', 'Error Leaving league');
    return res.redirect(`/lg/${req.league._id}`);
  }
  req.league = league;
  req.session.league = undefined;
  req.activity = { category: 'league', message: `left '${req.league.name}'` };
  await activity.addActivity(req, res);
  req.flash('success', `Left '${req.league.name}'`);
  res.redirect('/leagues');
};

exports.removeMember = async (req, res) => {
  const league = await League.findOneAndUpdate(
    { 
      _id: req.league._id,
      creator: { $ne: req.body.member },
      $and: [
        { moderators: { $ne: req.body.member } },
        { moderators: req.user._id },
      ],
      members: req.body.member,
    },
    { $pull: { members: req.body.member } },
    { new: true },
  );
  if (!league) {
    req.flash('error', 'Error Removing Member');
    return res.redirect(`/lg/${req.league._id}`);
  }
  req.league = league;
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
  return res.redirect(`/lg/${req.league._id}`);
};

exports.addModerator = async (req, res) => {
  const league = await League.findOneAndUpdate(
    { 
      _id: req.league._id,
      creator: req.user._id, 
      moderators: { $ne: req.body.member }, 
      members: req.body.member,
    },
    { $addToSet: { moderators: req.body.member } },
    { new: true },
  ).populate('moderators');
  if (!league) {
    req.flash('error', 'Error Adding Moderator');
    return res.redirect(`/lg/${req.league._id}`);
  }
  req.league = league;
  let userAffected = league.moderators.find(mod => mod.id === req.body.member);
  if (!userAffected) {
    req.flash('Error getting user info');
    userAffected = { username: 'UNKNOWN USER' };
  }
  req.activity = { category: 'moderator', message: `added ${userAffected.username} as a moderator` };
  await activity.addActivity(req, res);
  req.flash('success', 'Added Moderator');
  return res.redirect(`/lg/${req.league._id}`);
};

exports.removeModerator = async (req, res) => {
  const league = await League.findOneAndUpdate(
    { 
      _id: req.league._id,
      $and: [
        { creator: req.user._id, },
        { creator: { $ne: req.body.member } }
      ],
      moderators: req.body.member,
    },
    { $pull: { moderators: req.body.member } },
    { new: true },
  );
  if (!league) {
    req.flash('error', 'Error Removing Moderator');
    return res.redirect(`/lg/${req.league._id}`);
  }
  req.league = league;
  let userAffected = await User.findOne({ _id: req.body.member });
  if (!userAffected) {
    req.flash('Error getting user info');
    userAffected = { username: 'UNKNOWN USER' };
  }
  req.activity = { category: 'moderator', message: `removed ${userAffected.username} as a moderator` };
  await activity.addActivity(req, res);
  req.flash('success', 'Removed Moderator');
  return res.redirect(`/lg/${req.league._id}`);
};