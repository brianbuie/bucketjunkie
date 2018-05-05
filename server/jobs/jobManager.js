const schedule = require('node-schedule');
const autoDraft = require('./autoDraft');
const updateScores = require('./updateScores');
const playerInfo = require('./playerInfo');
const { catchErrors } = require('../handlers/errorHandlers');

const jobs = {};
const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;

exports.startup = () => {
  // manages its own schedule
  autoDraft.startup();

  // Player info and scores disabled for the offseason

  // update player scores every 30 minutes
  // setInterval(updateScores.update, 30 * MINUTE);

  // update player info every 12.25 hours
  // setInterval(playerInfo.update, 12.25 * HOUR);
};
