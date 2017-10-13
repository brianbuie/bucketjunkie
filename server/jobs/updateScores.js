const mongoose = require('mongoose');
const nbaService = require('../services/nbaService');
const activityService = require('../services/activityService');

const Game = mongoose.model('Game');
const Roster = mongoose.model('Roster');
const League = mongoose.model('League');
const Score = mongoose.model('Score');
const Box = mongoose.model('Box');

exports.update = async () => {
  console.log('checking for unscored games');
  const [unscoredGames, leagues] = await Promise.all([
    Game.find({ final: false, date: { $lt: Date.now() } }),
    League.find({ started: true })
  ]);
  unscoredGames.forEach(async game => {
    const gameState = await nbaService.fetchGame(game._id).catch(err => console.log(err));
    if (!gameState || !gameState.final) return;
    console.log(`Updating scores for game ${game._id}`);
    const boxes = await nbaService.fetchBoxscoresByGame(game._id).catch(err => console.log(err));
    if (!boxes) return;
    await Promise.all([
      leagues.forEach(async league => {
        await league.members.forEach(async member => {
          const effectiveRoster = await Roster.find({ 
            league: league._id,
            user: member,
            effective: { $lt: game.date }
          }).sort({ effective: -1 }).limit(1);
          if(!effectiveRoster[0]) return;
          const roster = effectiveRoster[0];
          boxes.forEach(async box => {
            if(!roster.players.includes(box.player)) return;
            const categories = ['ftm', 'fg2m', 'fg3m', 'reb', 'ast', 'blk', 'stl', 'to'];
            const total = categories.reduce(function(acc, cur) {
              return acc + (parseInt(box[cur]) * league.pointValues[cur]);
            }, 0);
            const score = { 
              league: league._id,
              user: roster.user,
              roster: roster._id,
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
      })
    ]);
    await Promise.all([
      Game.findOneAndUpdate({ _id: game.id }, { final: true }),
      boxes.map(box => (new Box(box)).save())
    ]);
  })
};