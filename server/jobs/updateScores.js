const mongoose = require('mongoose');

const game = mongoose.model('Game');

exports.startup = () => {
  // get yesterday's games

  // foreach game
    // if game is complete
      // get all player boxscores for each game
      // get all rosters where time is before game start, sort by data, get last
        // foreach roster
          // if player is on roster
            // get league point values
              // create score object
}