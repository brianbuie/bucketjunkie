const mongoose = require('mongoose');

const Activity = mongoose.model('Activity');

exports.addActivity = async (req, res) => {
  const action = {
    league: req.league._id,
    user: req.activity.user || req.user._id,
    category: req.activity.category,
    message: req.activity.message,
  };
  const newAction = new Activity(action);
  await newAction.save();
};

exports.getActivity = async (req, res) => {
  const member = ['league', 'roster', 'message'];
  const moderator = ['moderator'];
  const access = req.leagueAuth.isModerator ? moderator.concat(member) : member;
  return await Activity.find({ league: req.league._id, category: { $in: access } })
  .populate('user')
  .sort({ date: -1 });
};
