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

exports.stripFields = (req, res, next) => {
  const alwaysAccepted = ['name', 'description', 'public', 'open'];
  const onlyIfUnstarted = ['uniqueRosters', 'start', 'rosterSize', 'pointValues'];
  const acceptedFields = (req.league && req.league.started)
    ? alwaysAccepted
    : alwaysAccepted.concat(onlyIfUnstarted)
  const newBody = {};
  acceptedFields.map(field => newBody[field] = req.body[field]);
  req.body = newBody;
  return next();
};

exports.validateLeague = [
  sanitizeBody('name')
    .trim()
    .blacklist('<>'),
  body('name')
    .isLength({ min: 3 })
    .withMessage('Your league must have a name'),
  sanitizeBody('description')
    .blacklist('<>'),
  body('public')
    .isBoolean(),
  body('open')
    .isBoolean(),
  body('uniqueRosters')
    .isBoolean()
    .optional(),
  body('start')
    .custom(val => moment(val).isAfter(moment().add(5, 'minutes')))
    .withMessage('Start time must be at least 5 minutes in the future')
    .optional(),
  body('rosterSize').custom(val => val >= 1 && val <= 20)
    .withMessage('Roster Size must be between 1 and 20')
    .optional(),
  sanitizeBody('pointValues.*')
    .toInt(),
  body('pointValues.*')
    .custom(val => val <= 10 && val >= -10)
    .withMessage('Point values must be between -10 and 10')
    .optional(),
  body('pointValues')
    .custom(val => Object.keys(val).some(k => val[k] != 0))
    .withMessage('At least one stat must have a value')
    .optional(),
];

exports.createLeague = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.oops({ message: `Error! ${errors.array().map(e => e.msg).join(', ')}` });
  }
  req.body.members = [req.user];
  req.body.moderators = [req.user];
  req.body.creator = req.user;
  const league = await (new League(req.body)).save();
  if (!league) return res.oops('Something went wrong');
  req.session.league = league;
  const action = { user: req.user, league, category: 'league', message: `created league "${league.name}"`}
  await activityService.addAction(action);
  return res.greatJob({ message: 'League created', league });
};

exports.updateLeague = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.oops({ message: `Error! ${errors.array().map(e => e.msg).join(', ')}` });
  }
  req.league.set(req.body);
  if (!req.league.isModified()) {
    return res.greatJob('Nothing changed');
  }
  const actions = req.league.modifiedPaths()
    .filter(path => !/^pointValues$/.test(path))
    .map(path => {
      let action = { user: req.user, league: req.league, category: 'league' };
      if (path.includes('pointValues')) {
        let newPath = path.replace('pointValues.', '');
        action.message = `updated the point value for ${newPath.toUpperCase()} to ${req.league.pointValues[newPath]} points`;
      } else {
        action.message = `updated the league ${path} to "${req.league[path]}"`;
      }
      return action;
    });
  await req.league.save(err => err ? res.oops('Error updating league') : null);
  await Promise.all(actions.map(action => activityService.addAction(action)));
  return res.greatJob('Updated League');
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
  return res.greatJob({ leagues });
};

exports.myLeagues = async (req, res) => {
  const leagues = await League.find({ members: req.user._id });
  return res.greatJob({ leagues });
};

exports.verifyLeague = (req, res) => {
  if (req.session.league) return res.greatJob({ league: req.session.league });
  return res.oops('League not set!');
};

exports.getLeague = async (req, res) => {
  const league = await League.findOne({ _id: req.params.id })
    .populate('members')
    .populate('moderators')
    .populate('creator');
  if (!league) return res.oops('Can\'t find league');
  return res.greatJob({ league });
};

exports.joinLeague = async (req, res) => {
  const league = await League.findOne({ 
    _id: req.league._id, 
    open: true,
    blocked: { $ne: req.user._id },
    members: { $ne: req.user._id }
  })
    .populate('members')
    .populate('moderators');
  if (!league) return res.oops('Unable to join league');
  league.members.addToSet(req.user);
  await league.save();
  req.session.league = league;
  await activityService.addAction({
    user: req.user,
    league,
    category: 'league',
    message: 'joined',
  });
  return res.greatJob({ league });
};

exports.leaveLeague = async (req, res) => {
  const league = await League.findOne({
    _id: req.league._id,
    creator: { $ne: req.user._id }, 
    members: req.user._id,
  });
  if (!league) return res.oops('Error Leaving league');
  league.members.pull({ _id: req.user._id });
  league.moderators.pull({ _id: req.user._id });
  const removeQ = { league: req.league._id, user: req.user._id };
  const action = {
    user: req.user,
    league,
    category: 'league',
    message: 'left',
  };
  await Promise.all([ 
    Roster.remove(removeQ), 
    Draft.remove(removeQ), 
    Score.remove(removeQ), 
    league.save(),
    activityService.addAction(action)
  ]);
  req.session.league = undefined;
  return res.greatJob('Left League');
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
