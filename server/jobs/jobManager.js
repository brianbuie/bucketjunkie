const autoDraft = require('./autoDraft');
const updateScores = require('./updateScores');
const { catchErrors } = require('../handlers/errorHandlers');

const jobs = {};

exports.startup = () => {
  // sets its own schedule
  autoDraft.startup();

  setInterval(catchErrors(updateScores.update), 30*60*1000);
};
