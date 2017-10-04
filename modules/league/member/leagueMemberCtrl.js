const mongoose = require('mongoose');
const activityService = require('../../activity/activityService');
const userService = require('../../user/userService');

const League = mongoose.model('League');

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
  req.actions = [{ category: 'league', message: `joined ${req.league.name}`  }];
  await activityService.addActivity(req);
  req.actions = undefined;
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
  req.actions = [{ category: 'league', message: `left ${req.league.name}`  }];
  await activityService.addActivity(req);
  req.actions = undefined;
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
  req.actions = [
    { category: 'moderator', message: `removed ${await userService.getUsername(req.body.member)} as a member` },
    { category: 'league', message: `left ${req.league.name}`  }
  ];
  await activityService.addActivity(req);
  req.actions = undefined;
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
  req.actions = [{ category: 'moderator', message: `added ${await userService.getUsername(req.body.member)} as a moderator` }];
  await activityService.addActivity(req);
  req.actions = undefined;
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
  req.actions = [{ category: 'moderator', message: `removed ${await userService.getUsername(req.body.member)} as a moderator` }];
  await activityService.addActivity(req);
  req.actions = undefined;
  return res.redirect(`/lg/${req.league._id}`);
};