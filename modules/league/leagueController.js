const mongoose = require('mongoose');

const League = mongoose.model('League');
const User = mongoose.model('User');

exports.createLeague = async (req, res) => {
  req.body.members = [req.user._id];
  req.body.moderators = [req.user._id];
  req.body.creator = req.user._id;
  req.body.public = req.body.public || false;
  req.body.open = req.body.open || false;
  const league = await (new League(req.body)).save();
  if (!league) {
    req.flash('error', 'Error creating league, please try again.');
    return res.redirect('/league/create');
  }
  req.flash('success', `Successfully created ${league.name}`);
  return res.redirect(`/league/${league._id}`);
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
    return res.redirect(`/league/${league._id}`);
  }
  req.user.isCreator = league.creator.equals(req.user._id);
  return res.render('league/editLeague', { title: 'Edit League', league });
}

exports.joinLeague = async (req, res) => {
  const league = await League.findOneAndUpdate({ _id: req.params.id, open: true }, { $addToSet: { members: req.user.id } });
  if (!league) {
    req.flash('error', 'Unable to join league');
    return res.redirect('/leagues');
  }
  return res.redirect(`/league/${league._id}`);
}

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
  return res.render('league/leagueOverview', { title: `${league.name} Overview`, league });
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
  const league = await League.findOneAndUpdate({ _id: req.params.id, moderators: req.user._id }, req.body, { runValidators: true });
  if (!league) {
    req.flash('error', 'Error Updating League');
    return res.redirect('/leagues');
  }
  req.flash('success', 'Updated League');
  res.redirect(`/league/${league._id}`);
};

exports.updateUsers = async (req, res) => {
  if (!req.query.userid || !req.query.action) {
    req.flash('error', 'Error Updating League');
    return res.redirect('/leagues');
  }
  let find = { _id: req.params.id };
  let update = {};
  let success = [];
  if (req.query.action === "removeMember") {
    // can't remove creator
    find.creator = { $ne: req.query.userid };
    if (req.query.userid === req.user.id) {
      // remove self from members and moderators
      update.$pull = { members: req.query.userid, moderators: req.query.userid };
    } else {
      // mods can remove other non-mods
      find.$and = [{ moderators: req.user.id }, { moderators: { $ne: req.query.userid } }];
      update.$pull = { members: req.query.userid };
    }
    message = ['success', 'User successfully removed'];
  }
  if (req.query.action === "addModerator") {
    // mods can add other mods
    find.moderators = req.user.id;
    update.$addToSet = { moderators: req.query.userid };
    message = ['success', 'Moderator successfully added'];
  }
  if (req.query.action === "removeModerator") {
    // only the creator can remove mods, creator can't be removed
    find.$and = [{ creator: req.user.id }, { creator: { $ne: req.query.userid } }];
    update.$pull = { moderators: req.query.userid };
    message = ['success', 'Moderator successfully removed'];
  }
  const league = await League.findOneAndUpdate(find, update, { new: true });
  if (!league) {
    req.flash('error', 'Error Updating League');
    return res.redirect(`/league/${req.params.id}`);
  }
  req.flash(message);
  return res.redirect(`/league/${league._id}`);
}