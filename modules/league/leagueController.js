const mongoose = require('mongoose');
const activity = require('../activity/activityController');

const League = mongoose.model('League');

exports.createLeague = async (req, res) => {
  req.body.members = [req.user._id];
  req.body.moderators = [req.user._id];
  req.body.creator = req.user._id;
  req.body.public = req.body.public || false;
  req.body.open = req.body.open || false;
  const league = await (new League(req.body)).save();
  if (!league) {
    req.flash('error', 'Error creating league, please try again.');
    return res.render('/leagues/create', { title: 'Create League', league: req.body });
  }
  req.activity = { category: 'league', message: `created league '${league.name}'` };
  req.params.id = league._id;
  await activity.addAction(req, res);
  req.flash('success', `Successfully created ${league.name}`);
  return res.redirect(`/leagues/${league._id}`);
};

exports.createLeagueForm = (req, res) => res.render('league/createLeague', { title: 'Create League', league: {} });

exports.editLeagueForm = async (req, res) => {
  const league = await League.findOne({ _id: req.params.id })
    .populate({ path: 'members', model: 'User' })
    .populate({ path: 'moderators', model: 'User' })
    .populate('creator');
  if (!league) {
    req.flash('error', 'Sorry, that league is unavailable');
    return res.redirect('/leagues');
  }
  if (!league.moderators.some(mod => mod.equals(req.user._id))) {
    req.flash('error', 'You must be a moderator to edit this league');
    return res.redirect(`/leagues/${league._id}`);
  }
  req.user.isCreator = league.creator.equals(req.user._id);
  return res.render('league/editLeague', { title: 'Edit League', league });
};

exports.isModerator = async (req, res, next) => {
  const league = await League.findOne({ _id: req.params.id, moderators: req.user._id });
  if (!league) {
    req.flash('error', 'You must be a moderator to do that.');
    return res.redirect(`/leagues/${req.params._id}`);
  }
  return next();
}

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
  await activity.addAction(req, res);
  return res.redirect(`/leagues/${league._id}`);
};

exports.leagueOverview = async (req, res) => {
  const league = await League.findOne({ _id: req.params.id })
    .populate({ path: 'members', model: 'User' })
    .populate({ path: 'moderators', model: 'User' })
    .populate('creator');
  if (!league) {
    req.flash('error', 'Sorry, that league is unavailable');
    return res.redirect('/leagues');
  }
  req.user.isModerator = league.moderators.some(mod => mod._id.equals(req.user._id));
  req.user.isMember = league.members.some(member => member._id.equals(req.user._id));
  req.user.isCreator = league.creator.equals(req.user._id);
  if(league.members.some(member => member._id === req.user._id)) req.session.league = league;
  const activityFeed = await activity.getActions(req, res);
  return res.render('league/leagueOverview', { title: `${league.name} Overview`, league, activityFeed });
};

exports.myLeagues = async (req, res) => {
  const leagues = await League.find({ members: req.user._id });
  if (leagues.length) return res.render('league/leagueListings', { title: 'My Leagues', leagues });
  return res.redirect('/leagues/public');
};

exports.publicLeagues = async (req, res) => {
  const leagues = await League.find({ public: true, open: true });
  return res.render('league/leagueListings', { title: 'Public Leagues', leagues });
};

exports.updateLeague = async (req, res) => {
  req.body.public = req.body.public || false;
  req.body.open = req.body.open || false;
  const league = await League.findOneAndUpdate(
    { _id: req.params.id, moderators: req.user._id },
    req.body,
    { runValidators: true, new: true },
  );
  if (!league) {
    req.flash('error', 'Error Updating League');
    return res.redirect('/leagues');
  }
  // TODO get actual updates
  req.activity = { category: 'league', message: `updated '${league.name}'` };
  await activity.addAction(req, res);
  req.flash('success', 'Updated League');
  return res.redirect(`/leagues/${league._id}`);
};

const userActions = {
  removeMember: (userRequesting, userAffected, find, update) => {
    find.creator = { $ne: userAffected };
    if (userRequesting === userAffected) {
      // remove self from members and moderators
      update.$pull = { members: userAffected, moderators: userAffected };
    } else {
      // mods can remove other non-mods
      find.$and = [{ moderators: userRequesting }, { moderators: { $ne: userAffected } }];
      update.$pull = { members: userAffected };
    }
    return { find, update };
  },
  addModerator: (userRequesting, userAffected, find, update) => {
    // only mods can add other mods
    find.moderators = userRequesting;
    update.$addToSet = { moderators: userAffected };
    return { find, update };
  },
  removeModerator: (userRequesting, userAffected, find, update) => {
    // only the creator can remove mods, creator can't be removed
    find.$and = [{ creator: userRequesting }, { creator: { $ne: userAffected } }];
    update.$pull = { moderators: userAffected };
    return { find, update };
  },
};

exports.updateUser = async (req, res) => {
  const query = userActions[req.body.action](req.user.id, req.body.id, { _id: req.params.id }, {});
  const league = await League.findOneAndUpdate(query.find, query.update, { new: true });
  if (!league) {
    req.flash('error', 'Error Updating User');
  } else {
    req.activity = { category: 'moderator', message: `updated users` };
    await activity.addAction(req, res);
    req.flash('success', 'User updated');
  }
  return res.redirect(`/leagues/${req.params.id}`);
};
