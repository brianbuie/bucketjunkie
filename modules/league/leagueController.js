const mongoose = require('mongoose');
const League = mongoose.model('League');

exports.chooseLeague = (req, res) => {
  return res.render('leagues', { title: 'Choose League' });
};

exports.createLeague = async (req, res) => {
  const league = await (new League(req.body)).save();
  req.flash('success', `Successfully created ${league.name}`)
  res.redirect(`/league/${league._id}`);
};

exports.createLeagueForm = (req, res) => {
  return res.render('league/createLeague', { title: 'Create League' });
};

exports.editLeague = (req, res) => {
  return res.render('league/editLeague', { title: 'Edit League' });
};

exports.editLeagueForm = (req, res) => {
  return res.render('league/editLeague', { title: 'Edit League' });
};

exports.joinLeague = (req, res) => {
  req.flash('success', `Join ${req.params.id}`);
  return res.render('leagues', { title: 'Join League' });
};

exports.leagueDashboard = (req, res) => {
  req.flash('success', `${req.params.id} Dashboard`);
  return res.render('leagues', { title: 'League Dashboard' });
};