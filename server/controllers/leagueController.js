const mongoose = require('mongoose');
const moment = require('moment');
const { body, validationResult } = require('express-validator/check');
const { matchedData, sanitizeBody } = require('express-validator/filter');
const activityService = require('../services/activityService');
const rosterService = require('../services/rosterService');
const userService = require('../services/userService');
const nbaService = require('../services/nbaService');

const League = mongoose.model('League');
const Roster = mongoose.model('Roster');
const Draft = mongoose.model('Draft');
const Score = mongoose.model('Score');

exports.validateLeague = [
  sanitizeBody('name').trim().blacklist('<>'),
  body('name').isLength({ min: 3 })
    .withMessage('Your league must have a name'),
  sanitizeBody('description').blacklist('<>'),
  body('leagueType').isIn(['fantasy', 'contest']).optional(),
  body('start').custom((val, { req }) => {
    const converted = moment.utc(val).add(req.body['UTC-offset'], 'hours');
    const utcMin = moment().utc().add(5, 'minutes');
    return converted.isAfter(utcMin); 
  })
    .withMessage('Start time must be at least 5 minutes in the future').optional(),
  body('rosterSize').custom(val => val >= 1 && val <= 20)
    .withMessage('Roster Size must be between 1 and 20').optional(),
  sanitizeBody('pointValues.*').toInt(),
  body('pointValues.*').custom(val => val <= 10 && val >= -10)
    .withMessage('Point values must be between -10 and 10').optional(),
  body('pointValues').custom(val => Object.keys(val).some(k => val[k] != 0))
    .withMessage('At least one stat must have a value').optional(),
];

const timezoneInputFix = (reqDate, reqOffset) => {
  const serverOffset = new Date().getTimezoneOffset() / 60;
  const offset = reqOffset - serverOffset;
  return moment.utc(reqDate).add(offset, 'hours').format('YYYY-MM-DDTHH:mm');
};

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
  req.body.start = timezoneInputFix(req.body.start, req.body['UTC-offset']);
  const league = await (new League(req.body)).save();
  if (!league) return req.oops('Something went wrong');
  req.league = league;
  req.actions = [{ category: 'league', message: `created league "${req.league.name}"` }];
  await activityService.addActivity(req);
  return res.greatJob('League created');
};

exports.updateLeague = async (req, res) => {
  req.body.public = req.body.public || false;
  req.body.open = req.body.open || false;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(500).json({ message: 'Error!', errors: errors.array() });
  }
  if (!req.league.started) {
    req.body.start = timezoneInputFix(req.body.start, req.body['UTC-offset']);
  }
  req.league.set(req.body);
  if (!req.league.isModified()) {
    return res.greatJob('Nothing changed');
  }
  const rules = ['pointValues', 'rosterSize', 'uniqueRosters'];
  if (req.league.started && req.league.modifiedPaths().some(path => rules.includes(path))) {
    return req.oops('The league has already started');
  }
  req.actions = req.league.modifiedPaths()
    .filter(path => !/^pointValues$/.test(path))
    .map(path => {
      let action = { category: 'league' };
      if (path.includes('pointValues')) {
        let newPath = path.replace('pointValues.', '');
        action.message = `updated the point value for ${newPath.toUpperCase()} to ${req.league.pointValues[newPath]} points`;
      } else {
        action.message = `updated the league ${path} to "${req.league[path]}"`;
      }
      return action; 
    });
  await req.league.save(err => err ? req.oops('Error updating league') : null);
  await activityService.addActivity(req);
  return res.greatJob('Updated League');
};

exports.editLeagueForm = (req, res) => res.render('leagues/edit', { title: 'Edit League', league: req.league, leagueAuth: req.leagueAuth });

exports.createLeagueForm = (req, res) => {
  req.session.league = undefined;
  res.render('leagues/edit', { title: 'Create League', body: req.body });
};

exports.publicLeagues = async (req, res) => {
  const query = {
    public: true,
    open: true,
  };
  if (req.user) {
    query.members = { $ne: req.user._id };
    query.blocked = { $ne: req.user._id };
  }
  const leagues = await League.find(query);
  return res.render('leagues/public', { title: 'Join A League', leagues });
};

exports.myLeagues = async (req, res) => {
  const leagues = await League.find({ members: req.user._id });
  return res.greatJob({ leagues });
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

exports.leaderBoard = async (req, res) => {
  const [scores, upcomingGames] = await Promise.all([
    Score.getTotalScores(req.league._id),
    nbaService.gamesForDays(7)
  ]);
  const rostersRaw = req.league.drafting
    ? await rosterService.getDraft(req.league, req.user)
    : await rosterService.getRosters(req.league);
  let rosters = rostersRaw.map(roster => {
    roster = roster._id ? roster.toObject() : roster;
    const score = scores.find(score => score._id.equals(roster.user._id));
    roster.players = roster.players.map(player => appendPlayerScore(player, req.league.pointValues))
    roster.players = !req.league.drafting ? roster.players.sort(sortByScore) : roster.players;
    roster.score = score ? score.score : 0;
    return roster;
  }).sort(sortByScore);
  return res.render('league/leaderboard', { league: req.league, rosters, upcomingGames });
};

exports.info = (req, res) => res.render('league/info', { league: req.league });

exports.joinLeague = async (req, res) => {
  const league = await League.findOneAndUpdate(
    { 
      _id: req.league._id, 
      open: true,
      blocked: { $ne: req.user._id },
      members: { $ne: req.user._id }
    },
    { $addToSet: { members: req.user._id } },
  );
  if (!league) return req.oops('Unable to join league', `/lg/${req.league._id}`);
  req.league = league;
  req.actions = [{ category: 'league', message: `joined` }];
  await activityService.addActivity(req);
  return res.redirect(`/lg/${req.league._id}`);
};

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
  req.actions = [{ category: 'league', message: `left` }];
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
  await Promise.all([
    activityService.addAction({ league: req.league, user: req.user, category: 'moderation', message: `banned ${await userService.getUsername(req.body.member)}` }),
    activityService.addAction({ league: req.league, user: req.body.member, category: 'league', message: `left` })
  ]);
  return res.greatJob('Removed Member');
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
  req.actions = [{ category: 'moderation', message: `added ${await userService.getUsername(req.body.member)} as a moderator` }];
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
  req.actions = [{ category: 'moderation', message: `removed ${await userService.getUsername(req.body.member)} as a moderator` }];
  await activityService.addActivity(req);
  req.actions = undefined;
  return res.redirect(`/lg/${req.league._id}`);
};
