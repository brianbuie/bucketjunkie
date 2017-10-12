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
  // await Box.remove();
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

    // console.log('\ngetting boxscores');
    // const boxscores = await Promise.all(players.map(player => goGet('/boxscore/player', { player_id: player._id, season: 2016 }))); 
    // const toInsert = [];
    // boxscores.forEach(player => {
    //   if (player.length) player.map(score => toInsert.push(score));
    // });

    // console.log('\ninserting boxscores');
    // await Box.insertMany(toInsert.map(score => {
    //   score.game = score.game_id;
    //   score.team = score.team_id;
    //   score.player = score.player_id;
    //   score.opponent = score.opponent_id;
    //   score.fg2a = score.fga - score.fg3a;
    //   score.fg2m = score.fgm - score.fg3m;
    //   score.reb = score.oreb + score.dreb;
    //   return score;
    // }));

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
