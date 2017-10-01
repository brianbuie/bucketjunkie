require('dotenv').config({ path: __dirname + '/../variables.env' });
const fs = require('fs');

const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE);
const Team = require('../modules/nba/teamModel');
const Player = require('../modules/nba/playerModel');
const Game = require('../modules/nba/gameModel');

const teams = JSON.parse(fs.readFileSync(__dirname + '/teams.json', 'utf-8'));
const players = JSON.parse(fs.readFileSync(__dirname + '/players.json', 'utf-8'));
const games = JSON.parse(fs.readFileSync(__dirname + '/games.json', 'utf-8'));

async function deleteData() {
  await Team.remove();
  await Player.remove();
  await Game.remove();
  console.log('\nData deleted!');
  process.exit();
}

async function loadData() {
  try {
    await Team.insertMany(teams.map(team => { 
      team._id = team.id;
      team.full_name = `${team.city} ${team.team_name}`;
      return team; 
    }));
    await Player.insertMany(players.map(player => { 
      player._id = player.id; 
      return player; 
    }));
    await Game.insertMany(games.map(game => {
      game._id = game.id;
      game.final = false;
      return game;
    }));
    console.log('\nData loaded!')
    process.exit();
  } catch(e) {
    console.log(e);
    process.exit();
  }
}

if (process.argv.includes('--delete')) {
  deleteData();
} else {
  loadData();
}
