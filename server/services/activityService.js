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
  if (req.query.activity != 'scores') {
    activity = await Activity.find({ league: req.league._id, category: { $in: categories } })
      .populate('user');
  }
  if (categories.includes('scores')) {
    const scores = await Score.find({ league: req.league._id })
      .populate('user')
      .populate('player')
      .populate({ path: 'box', populate: [{ path: 'opponent' }, { path: 'game' }] })
    activity = activity.concat(scores.map(score => {
      return {
        _id: score._id,
        user: score.user,
        category: 'scores',
        message: `scored ${score.points} points from ${score.player.name} vs. ${score.box.opponent.abbreviation}`,
        date: score.box.game.date
      }
    }));
  }
  return activity.sort((a,b) => new Date(b.date) - new Date(a.date));
};
