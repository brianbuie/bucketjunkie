const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');
const activityService = require('../services/activityService');
const rosterService = require('../services/rosterService');

const League = mongoose.model('League');

const pointValues = [
  { attr: 'ftm', name: 'Free Throw made' },
  { attr: 'fg2m', name: '2-point field goal' },
  { attr: 'fg3m', name: '3-point field goal' },
  { attr: 'reb', name: 'Rebound' },
  { attr: 'ast', name: 'Assist' },
  { attr: 'blk', name: 'Block' },
  { attr: 'stl', name: 'Steal' },
  { attr: 'to', name: 'Turnover' },
];

exports.validateLeague = [
  sanitize('name').trim(),
  body('name').isLength({ min: 3 })
    .withMessage('Your league must have a name'),
  sanitize('description'),
  sanitize('public'),
  sanitize('uniqueRosters'),
  sanitize('rosterSize').toInt(),
  body('rosterSize').custom(val => val > 1)
    .withMessage('Roster Size must be greater than 0'),
  sanitize('pointValues.*').toInt(),
  body('pointValues.*').custom(val => val < 100)
    .withMessage('Point values must be less than 100'),
  body('pointValues').custom(val => Object.keys(val).some(k => val[k] > 0))
    .withMessage('At least one stat must be more than 0'),
];

exports.createLeague = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    errors.array().map(e => req.flash('error', e.msg));
    return res.redirect('back');
  }
  req.body.members = [req.user._id];
  req.body.moderators = [req.user._id];
  req.body.creator = req.user._id;
  req.body.public = req.body.public || false;
  req.body.uniqueRosters = req.body.uniqueRosters || false;
  const league = await (new League(req.body)).save();
  if (!league) return req.oops('Something went wrong');
  req.league = league;
  req.actions = [{ category: 'league', message: `created ${req.league.name}` }];
  await activityService.addActivity(req);
  return req.greatJob('League created', `/lg/${league._id}`);
};

exports.createLeagueForm = (req, res) => {
  req.session.league = undefined;
  res.render('league/createLeague', { title: 'Create League', pointValues });
}

exports.myLeagues = async (req, res) => {
  const leagues = await League.find({ members: req.user._id });
  if (leagues.length) return res.render('league/leagueListings', { title: 'My Leagues', leagues });
  return res.redirect('/leagues/public');
};

exports.publicLeagues = async (req, res) => {
  const query = {
    public: true,
    open: true,
  };
  if (req.user) query.members = { $ne: req.user._id };
  const leagues = await League.find(query);
  return res.render('league/leagueListings', { title: 'Public Leagues', leagues });
};

exports.editLeagueForm = (req, res) => res.render('league/editLeague', { title: 'Edit League' });

exports.leagueOverview = async (req, res, next) => {
  if (!req.league.public && !req.leagueAuth.isMember) return next();
  const promises = [activityService.getActivity(req), rosterService.getRosters(req.league)];
  const [activity, rosters] = await Promise.all(promises);
  return res.render('league/leagueOverview', { title: `${req.league.name} Overview`, league: req.league, activity, rosters});
};

exports.validateUpdate = [
  sanitize('name').trim(),
  body('name').isLength({ min: 3 })
    .withMessage('Your league must have a name'),
  sanitize('description'),
  sanitize('public'),
];

exports.updateLeague = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    errors.array().map(e => req.flash('error', e.msg));
    return res.redirect('back');
  }
  req.body.public = req.body.public || false;
  req.league.set(req.body);
  if (!req.league.isModified()) {
    return req.greatJob('Nothing changed', `/lg/${req.league._id}`);
  }
  req.actions = req.league.modifiedPaths().map(path => {
    const msg = { category: 'league', message: 'updated the leage' };
    if (path === 'public') {
      msg.message+= req.league.public ? ' to public' : ' to private';
    } else {
      msg.message+= ` ${path} to '${req.league[path]}'`;
    }
    return msg;
  });
  await req.league.save(err => err ? req.oops('Error updating league', `/lg/${league._id}/edit`) : null);
  await activityService.addActivity(req);
  req.flash('success', 'Updated League');
  return res.redirect(`/lg/${req.league._id}`);
};

exports.validateChat = [
  sanitize('message')
];

exports.chat = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    errors.array().map(e => req.flash('error', e.msg));
    return res.redirect(`/lg/${req.league._id}`);
  }
  req.actions = [{ category: 'message', message: req.body.message }];
  const msg = await activityService.addActivity(req);
  if (!msg) return req.oops('Error sending message, try again');
  return res.redirect(`/lg/${req.league._id}`);
};
