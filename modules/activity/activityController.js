const mongoose = require('mongoose');

const Activity = mongoose.model('Activity');

exports.addAction = async (req, res) => {
  const action = {
    league: req.params.id,
    user: req.user._id,
    category: req.activity.category,
    message: req.activity.message,
  };
  const newAction = new Activity(action);
  await newAction.save();
};

exports.getActions = async (req, res) => Activity.find({ league: req.params.id })
  .populate('user')
  .sort({ date: -1 });
