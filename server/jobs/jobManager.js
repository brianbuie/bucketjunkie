const schedule = require('node-schedule');
const autoDraft = require('./autoDraft');
const updateAverages = require('./updateAverages');
const updateScores = require('./updateScores');

const jobs = {};

exports.startup = () => {
  // sets its own schedule
  autoDraft.startup();

  // update averages hourly, on minute 57
  const updateAverageRule = new schedule.RecurrenceRule();
  updateAverageRule.minute = 57;
  jobs.updatAverages = schedule.scheduleJob(updateAverageRule, function() { updateAverages.update(); });

  updateScores.startup();
};
