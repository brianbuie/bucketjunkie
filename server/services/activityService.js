const mongoose = require('mongoose');

const Activity = mongoose.model('Activity');

exports.addActivity = async req => {
  const activityPromises = req.actions.map(action => {
    const actionToAdd = action;
    actionToAdd.user = req.user._id;
    actionToAdd.league =  req.league._id;
    return (new Activity(actionToAdd)).save();
  });
  return await Promise.all(activityPromises);
};

exports.addAction = async action => (new Activity(action)).save();

exports.getActivity = async req => {
  const member = ['league', 'rosters', 'scoring', 'chat'];
  const moderator = ['moderation'];
  const access = req.leagueAuth.isModerator ? member.concat(moderator) : member;
  return await Activity.find({ league: req.league._id, category: { $in: access } })
    .sort({ _id: -1 })
    .limit(30)
    .populate('user');
};
