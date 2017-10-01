require('dotenv').config({ path: __dirname + '/../variables.env' });
const fs = require('fs');

const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE);
const Team = require('../modules/nba/teamModel');
const Player = require('../modules/nba/playerModel');

const teams = JSON.parse(fs.readFileSync(__dirname + '/teams.json', 'utf-8'));
const players = JSON.parse(fs.readFileSync(__dirname + '/players.json', 'utf-8'));

async function deleteData() {
  await Team.remove();
  await Player.remove();
  console.log('\nData deleted!');
  process.exit();
}

async function loadData() {
  try {
    await Team.insertMany(teams.map(team => { team._id = team.id; return team; }));
    await Player.insertMany(players.map(player => { player._id = player.id; return player; }));
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
