const mongoose = require('mongoose');
const activity = require('../activity/activityController');

const League = mongoose.model('League');

exports.editLeagueForm = (req, res) => res.render('league/editLeague', { title: 'Edit League' });

exports.leagueOverview = async (req, res) => {
  if (!req.league.public && !req.leagueAuth.isMember) {
    req.flash('Sorry, that league is private');
    res.redirect('/leagues');
  }
  const activityFeed = await activity.getActivity(req, res);
  return res.render('league/leagueOverview', { title: `${req.league.name} Overview`, league: req.league, activityFeed });
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
    return res.redirect(`/lg/${league._id}/edit`);
  }
  // TODO get dif between old/new for actual updates
  req.activity = { category: 'league', message: `updated '${league.name}'` };
  await activity.addActivity(req, res);
  req.flash('success', 'Updated League');
  return res.redirect(`/lg/${league._id}`);
};
