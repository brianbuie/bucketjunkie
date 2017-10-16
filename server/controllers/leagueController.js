const mongoose = require('mongoose');
const moment = require('moment');
const { body, validationResult } = require('express-validator/check');
const { matchedData, sanitizeBody } = require('express-validator/filter');
const activityService = require('../services/activityService');
const rosterService = require('../services/rosterService');
const userService = require('../services/userService');

const League = mongoose.model('League');
const Roster = mongoose.model('Roster');
const Draft = mongoose.model('Draft');
const Score = mongoose.model('Score');

exports.validateLeague = [
  sanitizeBody('name').trim(),
  body('name').isLength({ min: 3 })
    .withMessage('Your league must have a name'),
  sanitizeBody('description'),
  body('leagueType').isIn(['fantasy', 'contest']).optional(),
  body('start').custom(val => moment(val).isAfter(moment().add(5, "m")))
    .withMessage('Start time must be at least 5 minutes in the future').optional(),
  body('rosterSize').custom(val => val >= 1 && val <= 20)
    .withMessage('Roster Size must be between 1 and 20').optional(),
  sanitizeBody('pointValues.*').toInt(),
  body('pointValues.*').custom(val => val < 100)
    .withMessage('Point values must be less than 100').optional(),
  body('pointValues').custom(val => Object.keys(val).some(k => val[k] != 0))
    .withMessage('At least one stat must have a value').optional(),
];

exports.createLeague = async (req, res) => {
  req.body.public = req.body.public || false;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash('error', errors.array().map(e => e.msg));
    return this.createLeagueForm(req, res);
  }
  req.body.uniqueRosters = req.body.leagueType === "fantasy";
  req.body.members = [req.user._id];
  req.body.moderators = [req.user._id];
  req.body.creator = req.user._id;
  const league = await (new League(req.body)).save();
  if (!league) return req.oops('Something went wrong');
  req.league = league;
  req.actions = [{ category: 'league', message: `created ${req.league.name}` }];
  await activityService.addActivity(req);
  return req.greatJob('League created', `/lg/${league._id}`);
};

exports.updateLeague = async (req, res) => {
  req.body.public = req.body.public || false;
  req.body.open = req.body.open || false;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    errors.array().map(e => req.flash('error', e.msg));
    return res.redirect('back');
  }
  req.league.set(req.body);
  if (!req.league.isModified()) {
    return req.greatJob('Nothing changed', `/lg/${req.league._id}`);
  }
  const rules = ['pointValues', 'rosterSize', 'uniqueRosters'];
  if (req.league.started && req.league.modifiedPaths().some(path => rules.includes(path))) {
    return req.oops('The league has already started');
  }
  req.actions = req.league.modifiedPaths()
    .filter(path => path != 'pointValues')
    .map(path => { return { category: 'league', message: `updated the league ${path} to "${req.league[path]}"` } });
  await req.league.save(err => err ? req.oops('Error updating league', `/lg/${league._id}/edit`) : null);
  await activityService.addActivity(req);
  req.flash('success', 'Updated League');
  return res.redirect(`/lg/${req.league._id}`);
};

exports.editLeagueForm = (req, res) => res.render('league/editLeague', { title: 'Edit League' });

exports.createLeagueForm = (req, res) => {
  req.session.league = undefined;
  res.render('league/createLeague', { title: 'Create League', body: req.body });
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

const sortByScore = (a,b) => {
  if (a.score < b.score) return 1;
  if (a.score > b.score) return -1;
  return 0;
};

const appendPlayerScore = (player, pointValues) => {
  // player = player.toObject();
  const categories = ['ftm', 'fg2m', 'fg3m', 'reb', 'ast', 'blk', 'stl', 'to'];
  player.score = categories.reduce((sum, stat) => sum + (player.averages[stat] * pointValues[stat]), 0);
  return player;
};

// this is a mess
exports.leagueOverview = async (req, res, next) => {
  if (!req.league.public && !req.leagueAuth.isMember) return next();
  const [activity, rosters, scores, draftList] = await Promise.all([
    activityService.getActivity(req), 
    rosterService.getRosters(req.league),
    Score.getTotalScores(req.league._id),
    Draft.findOne({ user: req.user, league: req.league }).populate('players')
  ]);
  const league = req.league.toObject();
  const draft = draftList.toObject();
  if (!league.drafting) {
    league.members = league.members.map(member => {
      const score = scores.find(score => score._id.equals(member._id));
      // this is weird, rosterService returns [ [] ] when no rosters found
      const roster = rosters && rosters[0].length ? rosters.find(roster => roster.user._id.equals(member._id)) : null;
      if (roster) {
        member.roster = roster.players.map(player => appendPlayerScore(player, league.pointValues)).sort(sortByScore);
      } else {
        member.roster = [];
      }
      member.score =  score ? score.score : 0;
      return member;
    });
    league.members.sort(sortByScore);
  } else {
    draft.players = draft.players.map(player => appendPlayerScore(player, league.pointValues));
  }
  return res.render('league', { title: `${req.league.name} Overview`, league, draft, activity });
};

exports.validateChat = [
  sanitizeBody('message')
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

exports.joinLeague = async (req, res) => {
  const league = await League.findOneAndUpdate(
    { 
      _id: req.league._id, 
      open: true,
      blocked: { $ne: req.user._id }
    },
    { $addToSet: { members: req.user._id } },
  );
  if (!league) return req.oops('Unable to join league', `/lg/${req.league._id}`);
  req.league = league;
  req.actions = [{ category: 'league', message: `joined ${req.league.name}` }];
  await activityService.addActivity(req);
  return res.redirect(`/lg/${req.league._id}`);
};

exports.confirmLeaveLeague = (req, res) => res.render('league/leaveLeague', { title: 'Leave League' });

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
  if (!league) return req.oops('Error Leaving league', `/lg/${req.league._id}`);
  const removeQ = { league: req.league._id, user: req.user._id };
  await Promise.all([ Roster.remove(removeQ), Draft.remove(removeQ), Score.remove(removeQ) ]);
  req.league = league;
  req.session.league = undefined;
  req.actions = [{ category: 'league', message: `left ${req.league.name}` }];
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
    { 
      $pull: { members: req.body.member },
      $addToSet: { blocked: req.body.member }
    },
    { new: true },
  );
  if (!league) return req.oops('Error Removing Member' `/lg/${req.league._id}`);
  const removeQ = { league: req.league._id, user: req.body.member };
  await Promise.all([ Roster.remove(removeQ), Draft.remove(removeQ), Score.remove(removeQ) ]);
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
  if (!league) return req.oops('Error Adding Moderator', `/lg/${req.league._id}`);
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
  if (!league) return req.oops('Error Removing Moderator', `/lg/${req.league._id}`);
  req.league = league;
  req.actions = [{ category: 'moderator', message: `removed ${await userService.getUsername(req.body.member)} as a moderator` }];
  await activityService.addActivity(req);
  req.actions = undefined;
  return res.redirect(`/lg/${req.league._id}`);
};
