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
  await Box.remove();
  console.log('\nData deleted!');
}

async function data() {
  try {
    await deleteData();
    console.log('full send');

    let players = await Player.find({});
    console.log(players.length);

    const boxscores = await Promise.all(players.map(player => goGet('/boxscore/player', { player_id: player._id, season: 2016 }))); 

    boxscores.map(score => console.log(score.length));


    // TODO get boxscores for each player, remove player if no boxscores
    // let scores = await goGet('/boxscore/player', { player_id: player._id, season: 2016 });

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
      if (error) reject(error);
      if (response.statusCode == 200) {
        resolve(JSON.parse(body));
      } else {
        console.log(options);
        console.log(response.statusCode);
        resolve([]);
      }
    });
  });
}

data();
