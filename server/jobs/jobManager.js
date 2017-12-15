const schedule = require('node-schedule');
const autoDraft = require('./autoDraft');
const updateScores = require('./updateScores');
const playerInfo = require('./playerInfo');
const { catchErrors } = require('../handlers/errorHandlers');

const jobs = {};

exports.startup = () => {
  // manages its own schedule
  autoDraft.startup();

  // update player scores on the :00 and :30 of every hour
  schedule.scheduleJob('0 0 * * * *', catchErrors(updateScores.update));
  schedule.scheduleJob('0 30 * * * *', catchErrors(updateScores.update));

  // update player info at 4:15 am every day
  schedule.scheduleJob('15 4 * * *', catchErrors(playerInfo.update));

};
