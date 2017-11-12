const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator/check');
const { matchedData, sanitizeBody } = require('express-validator/filter');
const activityService = require('../services/activityService');

const Activity = mongoose.model('Activity');
const Score = mongoose.model('Score');

exports.validateChat = [
  sanitizeBody('message').blacklist('<>')
];

exports.chat = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw new Error ('Error sending message, try again');
  const action = await activityService.addAction({
    user: req.user,
    league: req.league,
    category: 'chat', 
    message: req.body.message
  });
  if (!action) throw new Error ('Error sending message, try again');
  return req.greatJob();
};

exports.getActivity = async (req, res) => {
  const member = ['league', 'rosters', 'chat', 'scores'];
  const moderator = ['moderation'];
  let categories = req.leagueAuth.isModerator ? member.concat(moderator) : member;
  if (req.query.category && req.query.category != "all") categories = categories.filter(cat => cat === req.query.category);
  const newerThan = req.query.newerThan ? req.query.newerThan : req.league.created;
  const olderThan = req.query.olderThan ? req.query.olderThan : Date.now();
  let activity = [];
  if (req.query.activity != 'scores') {
    activity = await Activity.find({ 
      league: req.league._id, 
      category: { $in: categories },
      date: { $gt: newerThan, $lt: olderThan }
    })
      .populate('user', 'username');
    activity = activity.map(action => action.toObject());
  }
  if (categories.includes('scores')) {
    const scores = await Score.find({ 
      league: req.league._id, 
      date: { $gt: newerThan, $lt: olderThan }
    })
      .populate('user', 'username')
      .populate('player')
      .populate({ path: 'box', populate: [{ path: 'opponent' }, { path: 'game' }] })
    activity = activity.concat(scores.map(score => {
      return {
        _id: score._id,
        user: score.user,
        category: 'scores',
        message: `scored ${score.points} points from ${score.player.name} vs. ${score.box.opponent.abbreviation}`,
        date: score.date
      }
    }));
  }
  activity = activity
    .map((act, i) => {
      act.key = i;
      return act;
    })
    .sort((a,b) => {
      const dateDiff = new Date(b.date) - new Date(a.date);
      if (dateDiff == 0) return b.key - a.key;
      return dateDiff;
    })
    .splice(0, 200)
    .reverse()
  return activity;
};

exports.get = async (req, res) => {
  const activity = await this.getActivity(req, res);
  return res.json(activity);
};