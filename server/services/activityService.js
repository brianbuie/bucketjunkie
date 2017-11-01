const mongoose = require('mongoose');

const Team = mongoose.model('Team')
const Activity = mongoose.model('Activity');
const Score = mongoose.model('Score');

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
  const member = ['league', 'rosters', 'chat', 'scores'];
  const moderator = ['moderation'];
  let categories = req.leagueAuth.isModerator ? member.concat(moderator) : member;
  if (req.query.activity) categories = categories.filter(cat => cat === req.query.activity);
  let activity = [];
  const newerThan = req.query.newerThan ? req.query.newerThan : req.league.created;
  const olderThan = req.query.olderThan ? req.query.olderThan : Date.now();
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
  activity = activity.map((act, i) => {
    act.key = i;
    return act;
  });
  return activity.sort((a,b) => {
    const dateDiff = new Date(b.date) - new Date(a.date);
    if (dateDiff == 0) {
      return b.key - a.key;
    }
    return dateDiff;
  });
};
