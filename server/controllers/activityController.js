const { body, validationResult } = require('express-validator/check');
const { matchedData, sanitizeBody } = require('express-validator/filter');
const activityService = require('../services/activityService');

exports.get = async (req, res) => {
  const activity = await activityService.getActivity(req);
  return res.json(activity.reverse());
};

exports.validateChat = [
  sanitizeBody('message')
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
  return this.get(req, res);
};