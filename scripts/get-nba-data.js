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
const nbaService = require('../server/services/nbaService');


async function deleteData() {
  await Team.remove();
  await Player.remove();
  await Game.remove();
  await Box.remove();
  await Score.remove();
  console.log('\nData deleted!');
}

async function data() {
  try {
    await deleteData();

    let players = await nbaService.fetchAllPlayers();
    const games = await nbaService.fetchAllGames();
    const teams = await nbaService.fetchAllTeams();

    console.log('\ninserting teams');
    await Team.insertMany(teams.map(team => { 
      team._id = team.id;
      team.name = team.team_name;
      team.full_name = `${team.city} ${team.team_name}`;
      return team; 
    }));

    console.log('\ninserting games');
    await Game.insertMany(games.map(game => {
      game._id = game.id;
      game.home = game.home_id;
      game.away = game.away_id;
      game.final = false;
      return game;
    }));

    console.log('\ninserting players');
    await Player.insertMany(players.map(player => {
      player._id = player.id;
      player.team = player.team_id;
      player.name = player.player_name;
      return player;
    }));

    console.log('\nData loaded!');
    process.exit();
  } catch(e) {
    console.log(e);
    process.exit();
  }
}

data();
