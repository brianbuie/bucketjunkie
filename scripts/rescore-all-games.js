require('dotenv').config({ path: __dirname + '/../variables.env' });
const fs = require('fs');
const moment = require('moment');
const mongoose = require('mongoose');
const request = require('request');

mongoose.connect(process.env.DATABASE, {
  useMongoClient: true
});
mongoose.Promise = global.Promise;
mongoose.connection.on('error', (err) => {
  console.error(`🚫 → ${err.message}`);
});

const Team = require('../server/models/Team');
const Player = require('../server/models/Player');
const Game = require('../server/models/Game');
const Box = require('../server/models/Box');
const Score = require('../server/models/Score');
const Roster = require('../server/models/Roster')();
const League = require('../server/models/League')();

const nbaService = require('../server/services/nbaService');
const updateScores = require('../server/jobs/updateScores');

async function go() {
  try {
    await Promise.all([
      Game.remove(),
      Box.remove(),
      Score.remove()
    ]);
    console.log('\nData deleted!');
    const games = await nbaService.fetchAllGamesNotFinal();
    console.log('\nInserting games');
    await Game.insertMany(games);
    console.log('\nGames loaded');
    console.log('\nUpdating Scores');
    await updateScores.update();
  } catch(e) {
    console.log(e);
  }
  process.exit();
}

go();