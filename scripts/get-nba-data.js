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


async function deleteData() {
  await Team.remove();
  await Player.remove();
  await Game.remove();
  await Box.remove();
  console.log('\nData deleted!');
}

async function data() {
  try {
    await deleteData();
    console.log('full send');

    let players = await goGet('/player', {});
    const games = await goGet('/game', { season: 2016 });
    const teams = await goGet('/team', {});
    // const boxes = [];

    await Team.insertMany(teams.map(team => { 
      team._id = team.id;
      team.name = team.team_name;
      team.full_name = `${team.city} ${team.team_name}`;
      return team; 
    }));
    await Game.insertMany(games.map(game => {
      game._id = game.id;
      game.home = game.home_id;
      game.away = game.away_id;
      // for testing
      game.date = moment(game.date).subtract(1, 'months');
      game.final = game.date.isBefore(moment());
      return game;
    }));

    await Promise.all(players.map(async player => {
      return new Promise(async (resolve, reject) => {
        player._id = player.id;
        player.team = player.team_id;
        player.name = player.player_name;
        let scores = await goGet('/boxscore/player', { player_id: player._id, season: 2016 });
        if (!scores.length) resolve();
        console.log('Inserting ' + player.name);
        const playerInsert = await (new Player(player)).save();
        if (!playerInsert) reject();
        const boxes = await Box.insertMany(scores);
        if (!boxes) reject();
        resolve();
      });
    }));

    console.log('\nData loaded!')
    process.exit();
  } catch(e) {
    console.log(e);
    process.exit();
  }
}

async function goGet(path, query) {
  return new Promise((resolve, reject) => {
    const options = {
      method: 'POST',
      url: 'http://api.probasketballapi.com' + path,
      qs: query,
      headers: { 'cache-control': 'no-cache' },
    };
    options.qs.api_key = process.env.API_KEY;
    request(options, function (error, response, body) {
      if (error) reject(error);
      if (response.statusCode != 200) {
        console.log(response.statusCode);
        reject();
      }
      resolve(JSON.parse(body));
    });
  });
}

data();
