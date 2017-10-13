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

    let players = await goGet('/player', {});
    const games = await goGet('/game', { season: 2016 });
    const teams = await goGet('/team', {});

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
      
      // for testing
      game.date = moment(game.date).subtract(1, 'months').add(1, 'years');
      game.final = game.date.isBefore(moment());
      return game;
    }));

    console.log('\ninserting players');
    await Player.insertMany(players.map(player => {
      player._id = player.id;
      player.team = player.team_id;
      player.name = player.player_name;
      return player;
    }));

    console.log('\ngetting boxscores');
    const gameBoxes = await Promise.all(games.map(game => {
      if (game.final) return goGet('/boxscore/player', { game_id: game._id });
      return [];
    })); 
    const toInsert = [];
    gameBoxes.forEach(game => {
      if (game.length) game.map(box => toInsert.push(box));
    });

    console.log('\ninserting boxscores');
    await Box.insertMany(toInsert.map(box => {
      box.game = box.game_id;
      box.team = box.team_id;
      box.player = box.player_id;
      box.opponent = box.opponent_id;
      box.fg2a = box.fga - box.fg3a;
      box.fg2m = box.fgm - box.fg3m;
      box.reb = box.oreb + box.dreb;
      return box;
    }));

    // TODO recheck results errors

    console.log('\nData loaded!');
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
      if (error) {
        console.log(error);
        resolve([]);
      }
      if (!response || response.statusCode != 200) {
        console.log(options);
        resolve([]);
      } else {
        resolve(JSON.parse(body));
      }
    });
  });
}

data();
