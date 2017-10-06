require('dotenv').config({ path: __dirname + '/../variables.env' });
const fs = require('fs');
const moment = require('moment');
const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE);
const Team = require('../server/models/Team');
const Player = require('../server/models/Player');
const Game = require('../server/models/Game');

const teams = JSON.parse(fs.readFileSync(__dirname + '/data/teams.json', 'utf-8'));
const players = JSON.parse(fs.readFileSync(__dirname + '/data/players.json', 'utf-8'));
const games = JSON.parse(fs.readFileSync(__dirname + '/data/games.json', 'utf-8'));

async function deleteData() {
  await Team.remove();
  await Player.remove();
  await Game.remove();
  console.log('\nData deleted!');
}

async function data() {
  try {
    await deleteData();
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
      game.date = moment(game.date).subtract(1, 'months');
      game._id = game.id;
      game.final = game.date.isBefore(moment());
      return game;
    }));
    console.log('\nData loaded!')
    process.exit();
  } catch(e) {
    console.log(e);
    process.exit();
  }
}

data();
