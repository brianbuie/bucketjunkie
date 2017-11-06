const mongoose = require('mongoose');
const io = require('socket.io');
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