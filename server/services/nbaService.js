const mongoose = require('mongoose');
const request = require('request');

const Player = mongoose.model('Player');
const Team = mongoose.model('Team');

exports.player = async id => await Player.findOne({ _id: id }).populate('team');

exports.team = async id => await Team.findOne({ _id: id });

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

exports.fetchGame = (id) => fetch('/game', { game_id: id });

exports.fetchGamesByDate = (date) => fetch('/game', { date }); // MM/DD/YYYY

exports.fetchBoxscoresByPlayer = (id) => fetch('/boxscore/player', { player_id: id, season: 2016 });

exports.fetchBoxscoresByGame = (id) => fetch('/boxscore/player', { game_id: id, season: 2016 });

exports.mutateBoxscore = box => {
  box.game = box.game_id;
  box.team = box.team_id;
  box.player = box.player_id;
  box.opponent = box.opponent_id;
  box.fg2a = box.fga - box.fg3a;
  box.fg2m = box.fgm - box.fg3m;
  box.reb = box.oreb + box.dreb;
  return box;
}