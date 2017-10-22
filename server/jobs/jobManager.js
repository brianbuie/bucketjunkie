const autoDraft = require('./autoDraft');
const updateAverages = require('./updateAverages');
const updateScores = require('./updateScores');
const { catchErrors } = require('../handlers/errorHandlers');

const jobs = {};

exports.startup = () => {
  // sets its own schedule
  autoDraft.startup();

  // ever 30 minutes: updateScores 5 minutes later, updateAverages 10 minutes later
  // ensures these tasks won't overlap
  setInterval(() => {
    setTimeout(catchErrors(updateScores.update), 5*60*1000)
    setTimeout(catchErrors(updateAverages.update), 10*60*1000)
  }, 30*60*1000);
};
