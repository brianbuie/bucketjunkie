const mongoose = require('mongoose');
const schedule = require('node-schedule');
const rosterService = require('../services/rosterService');

const League = mongoose.model('League');

exports.init = async () => {
  const leagues = await League.find({ start: { $gt: new Date() }});
  leagues.map(league => {
    console.log(`Scheduling autodraft for ${league.name} \t${league.start}`);
    League.jobs[league._id] = schedule.scheduleJob(league.start, function() {
      rosterService.autoDraft(league);
    })
  });
};