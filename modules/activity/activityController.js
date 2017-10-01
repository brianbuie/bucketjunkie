const mongoose = require('mongoose');

const Activity = mongoose.model('Activity');

exports.addActivity = async (req, res) => {
  const action = {
    league: req.league._id,
    user: req.user._id,
    category: req.activity.category,
    message: req.activity.message,
  };
  const newAction = new Activity(action);
  await newAction.save();
};

exports.getActivity = async (req, res) => Activity.find({ league: req.league._id })
  .populate('user')
  .sort({ date: -1 });
