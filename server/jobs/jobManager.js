const autoDraft = require('./autoDraft');
const updateAverages = require('./updateAverages');
const updateScores = require('./updateScores');

const jobs = {};

exports.startup = () => {
  // sets its own schedule
  autoDraft.startup();

  // updateScores.update()
  // updateAverages.update()

  // ever 30 minutes: updateScores 5 minutes later, updateAverages 10 minutes later
  // ensures these tasks won't overlap
  setInterval(() => {
    setTimeout(updateScores.update, 5*60*1000)
    setTimeout(updateAverages.update, 10*60*1000)
  }, 30*60*1000);
};
