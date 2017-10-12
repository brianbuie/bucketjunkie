const mongoose = require('mongoose');
const request = require('request');

const Player = mongoose.model('Player');

exports.player = async id => await Player.findOne({ _id: id }).populate('team');

const fetch = async (path, query) => {
  return new Promise((resolve, reject) => {
    const options = {
      method: 'POST',
      url: 'http://api.probasketballapi.com' + path,
      qs: query,
      headers: { 'cache-control': 'no-cache' },
    };
    options.qs.api_key = process.env.API_KEY;
    request(options, function (error, response, body) {
      if (error) return reject(error);
      if (response.statusCode != 200) return reject(response.statusCode);
      resolve(JSON.parse(body));
    });
  });
};

exports.fetchAllPlayers = () => fetch('/player', {});

exports.fetchAllTeams = () => fetch('/team', {});

exports.fetchAllGames = () => fetch('/game', { season: 2016 });

exports.fetchGamesByDate = (date) => fetch('/game', { date }); // MM/DD/YYYY

exports.fetchBoxscoresByPlayer = (id) => fetch('/boxscore/player', { player_id: id, season: 2016 });

exports.fetchBoxscoresByGame = (id) => fetch('/boxscore/player', { game_id: id, season: 2016 });