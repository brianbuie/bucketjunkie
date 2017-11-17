const mongoose = require('mongoose');
const moment = require('moment');
const nbaService = require('../services/nbaService');

const Game = mongoose.model('Game');
const Roster = mongoose.model('Roster');
const League = mongoose.model('League');
const Player = mongoose.model('Player');
const Score = mongoose.model('Score');
const Box = mongoose.model('Box');

const updateAverages = async () => {
  let start = Date.now();
  const allPlayers = await Player.find({});
  let players = await Promise.all(allPlayers.map(player => Player.getAverages(player._id)));
  players = players.map(player => player[0]);
  let updatedPlayers = await Promise.all(players.map(player => {
    const categories = ['ftm', 'fg2m', 'fg3m', 'reb', 'ast', 'blk', 'stl', 'to'];
    const update = {};
    categories.forEach(cat => update[`averages.${cat}`] = player.averages[cat]);
    return Player.findOneAndUpdate({ _id: player._id }, update, { new: true });
  }));
  console.log(`${moment().format()}: Updated player averages in ${Date.now() - start}ms`);
};

exports.update = async () => {
  let shouldUpdateAverages = false;
  const [unscoredGames, leagues] = await Promise.all([
    Game.find({ final: false, date: { $lt: Date.now() } }),
    League.find({ started: true })
  ]);
  await Promise.all(unscoredGames.map(async game => {
    let start = Date.now();
    const boxes = await nbaService.fetchBoxscoresByGame(game._id).catch(err => console.log(err));
    if (!boxes || !boxes.length || boxes[0].period !== "f") return;
    shouldUpdateAverages = true;
    const savedBoxes = await Promise.all(boxes.map(box => (new Box(box)).save()));
    await Promise.all(leagues.map(async league => {
      await Promise.all(league.members.map(async member => {
        const effectiveRoster = await Roster.find({ 
          league: league._id,
          user: member,
          effective: { $lt: game.date }
        }).sort({ effective: -1 }).limit(1);
        if(!effectiveRoster[0]) return;
        const roster = effectiveRoster[0];
        return Promise.all(savedBoxes.map(async box => {
          if(!roster.players.includes(box.player)) return;
          const categories = ['ftm', 'fg2m', 'fg3m', 'reb', 'ast', 'blk', 'stl', 'to'];
          const total = categories.reduce(function(acc, cur) {
            return acc + (parseInt(box[cur]) * league.pointValues[cur]);
          }, 0);
          // make the score's recorded date 3 hours after game start if the score is added way later
          const approxGameEnd = moment(game.date).add(3, 'hours');
          const recordDate = approxGameEnd.isBefore(moment()) ? approxGameEnd : moment();
          return (new Score({ 
            league: league._id,
            user: roster.user,
            roster: roster._id,
            player: box.player,
            box: box,
            points: total,
            date: recordDate
          })).save();
        }));
      }));
    }));
    await Game.findOneAndUpdate({ _id: game.id }, { final: true });
    console.log(`${moment().format()}: Updated scores for game ${game._id} in ${Date.now() - start}ms`);
    return;
  }));
  if (shouldUpdateAverages) await updateAverages();
};