const mongoose = require('mongoose');
const nbaService = require('../services/nbaService');
const activityService = require('../services/activityService');

const Game = mongoose.model('Game');
const Roster = mongoose.model('Roster');
const League = mongoose.model('League');
const Score = mongoose.model('Score');

exports.startup = async () => {
  const unscoredGames = await Game.find({ final: false, date: { $lt: Date.now() } });

  unscoredGames.forEach(async game => {
    const gameState = await nbaService.fetchGame(game._id);
    if (!gameState[0].final) return;
  
    const boxesPromise = nbaService.fetchBoxscoresByGame(game._id);
    const leaguesPromise = League.find({});
    const [boxes, leagues] = await Promise.all([boxesPromise, leaguesPromise]);

    await leagues.forEach(async league => {
      await league.members.forEach(async member => {
        const effectiveRoster = await Roster.find({ 
          league: league._id,
          user: member,
          effective: { $lt: game.date }
        }).sort({ effective: -1 }).limit(1);

        if(!effectiveRoster) return;

        boxes.forEach(async box => {
          box = nbaService.mutateBoxscore(box);
          if(!effectiveRoster[0].players.includes(box.player)) return;

          const categories = ['ftm', 'fg2m', 'fg3m', 'reb', 'ast', 'blk', 'stl', 'to'];
          const total = categories.reduce(function(acc, cur) {
            return acc + (parseInt(box[cur]) * league.pointValues[cur]);
          }, 0);
          const score = { 
            league: league._id,
            user: effectiveRoster.user,
            roster: effectiveRoster._id,
            player: box.player,
            game: box.game,
            points: total
          };
          const [player, opponent, newScore] = await Promise.all([
            nbaService.player(box.player),
            nbaService.team(box.opponent),
            (new Score(score)).save()
          ]);
          const action = {
            user: member, league, category: 'score',
            message: `scored ${total} points from ${player.name} vs. ${opponent.abbreviation}`
          };
          await activityService.addAction(action);
        });
      });
    });



  });
  // get games with date before now, final: false

  // foreach game
    // if game is complete
      // get all player boxscores for each game
      // get all rosters where time is before game start, sort by data, get last
        // foreach roster
          // if player is on roster
            // get league point values
              // create score object
}