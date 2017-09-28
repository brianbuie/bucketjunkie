const mongoose = require('mongoose');

const League = mongoose.model('League');
const User = mongoose.model('User');

exports.createLeague = async (req, res) => {
  req.body.members = [req.user._id];
  const league = await (new League(req.body)).save();
  req.flash('success', `Successfully created ${league.name}`);
  res.redirect(`/league/${league._id}`);
};

exports.createLeagueForm = (req, res) => res.render('league/createLeague', { title: 'Create League' });

exports.editLeague = (req, res) => res.render('league/editLeague', { title: 'Edit League' });

exports.editLeagueForm = (req, res) => res.render('league/editLeague', { title: 'Edit League' });

exports.leagueOverview = async (req, res) => {
  const league = await League.findOne({ _id: req.params.id }).populate({
    path: 'members',
    model: 'User',
  }).exec();
  if (league) return res.render('league/leagueOverview', { title: `${league.name} Overview`, league });
  req.flash('error', 'Sorry, that league is unavailable');
  return res.redirect('/leagues');
};

exports.myLeagues = async (req, res) => {
  const leagues = await League.find({ members: req.user._id });
  if (leagues.length) return res.render('league/leagueListings', { title: 'My Leagues', leagues });
  return res.redirect('/leagues/public');
};

exports.publicLeagues = async (req, res) => {
  const leagues = await League.find({ public: true });
  return res.render('league/leagueListings', { title: 'Public Leagues', leagues });
};
