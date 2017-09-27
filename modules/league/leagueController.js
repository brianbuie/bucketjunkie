const mongoose = require('mongoose');
const League = mongoose.model('League');

exports.createLeague = async (req, res) => {
  req.body.members = [{
    username: req.user._id,
    moderator: true,
    referer: 'creator'
  }];
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
  return res.render('leagues', { title: 'Join League' });
};

exports.leagueOverview = async (req, res) => {
  const league = await League.findOne({ _id: req.params.id }).populate({
    path: 'members',
    model: 'User',
    populate: { 
      path: 'id', 
      model: 'User' 
    }
  });
  if(league) return res.render('league/leagueOverview', { title: `${league.name} Overview`, league });
  req.flash('error', 'Sorry, that league is unavailable');
  res.redirect('/leagues');
};

exports.myLeagues = async (req, res) => {
  const leagues = await League.find();
  return res.render('league/leagueListings', { title: 'Public Leagues', leagues });
}

exports.publicLeagues = async (req, res) => {
  const leagues = await League.find();
  return res.render('league/leagueListings', { title: 'Public Leagues', leagues });
}