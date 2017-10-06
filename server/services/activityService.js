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

exports.getActivity = async req => {
  const member = ['league', 'roster', 'message'];
  const moderator = ['moderator'];
  const access = req.leagueAuth.isModerator ? member.concat(moderator) : member;
  return await Activity.find({ league: req.league._id, category: { $in: access } })
    .sort({ date: -1 })
    .limit(5)
    .populate('league')
    .populate('user');
};
