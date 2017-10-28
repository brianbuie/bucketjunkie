const activityService = require('../services/activityService');

exports.get = async (req, res) => {
  const activity = await activityService.getActivity(req);
  return res.json(activity.reverse());
};