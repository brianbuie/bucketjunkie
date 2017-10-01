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
  req.league = league;
  await activity.addActivity(req, res);
  req.flash('success', `Successfully created ${league.name}`);
  return res.redirect(`/leagues/${league._id}`);
};

exports.createLeagueForm = (req, res) => res.render('league/createLeague', { title: 'Create League', league: {} });

exports.editLeagueForm = (req, res) => res.render('league/editLeague', { title: 'Edit League', league: req.league });

exports.leagueOverview = async (req, res) => {
  if (!req.league.public && !req.leagueAuth.isMember) {
    req.flash('Sorry, that league is private');
    res.redirect('/leagues');
  }
  const activityFeed = await activity.getActivity(req, res);
  return res.render('league/leagueOverview', { title: `${req.league.name} Overview`, league: req.league, activityFeed });
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
    return res.redirect(`/leagues/${league._id}/edit`);
  }
  // TODO get dif between old/new for actual updates
  req.activity = { category: 'league', message: `updated '${league.name}'` };
  await activity.addActivity(req, res);
  req.flash('success', 'Updated League');
  return res.redirect(`/leagues/${league._id}`);
};
