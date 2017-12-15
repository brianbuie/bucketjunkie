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
      Team.remove(),
      Player.remove()
    ]);
    console.log('\nData deleted!');
    let players = await nbaService.fetchAllPlayers();
    const teams = await nbaService.fetchAllTeams();
    console.log('\ninserting teams');
    await Team.insertMany(teams);
    console.log('\ninserting players');
    await Player.insertMany(players.filter(player => !!player.team && !!player.name));
    await updateScores.updateAverages();
    console.log('\nData loaded!');
  } catch(e) {
    console.log(e);
  }
  process.exit();
}

go();
