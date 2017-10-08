const mongoose = require('mongoose');
const schedule = require('node-schedule');

const League = mongoose.model('League');

exports.checkStartTimes = async () => {
  const leagues = await League.find({ start: { $gt: new Date() }});
  if (!leagues) return [];
  console.log(`found ${leagues.length} leagues with upcoming drafts.`)
  return leagues.map(league => {
    schedule.scheduleJob(league.start, function(){
      console.log(`Would autodraft now for ${league.name}`);
    });
  });
};