const mongoose = require('mongoose');
const request = require('request');
const moment = require('moment');

const Player = mongoose.model('Player');
const Team = mongoose.model('Team');
const Game = mongoose.model('Game');

exports.player = async id => await Player.findOne({ _id: id }).populate('team');

exports.team = async id => await Team.findOne({ _id: id });

const mutateBoxscore = box => {
  box.game = box.game_id;
  box.team = box.team_id;
  box.player = box.player_id;
  box.opponent = box.opponent_id;
  box.fg2a = box.fga - box.fg3a;
  box.fg2m = box.fgm - box.fg3m;
  box.reb = box.oreb + box.dreb;
  return box;
};

const mutateGame = game => {
  game._id = game.id;
  game.home = game.home_id;
  game.away = game.away_id;
  return game;
};

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

exports.fetchAllGames = () => fetch('/game', { season: 2017 }); // Todo: predict season

exports.fetchGame = async id => {
  const game = await fetch('/game', { game_id: id }).catch(err => console.log(`error for game ${id}: ${err}`));
  return game ? mutateGame(game[0]) : null;
};

// exports.fetchGamesByDate = (date) => fetch('/game', { date }); // MM/DD/YYYY

// exports.fetchBoxscoresByPlayer = (id) => fetch('/boxscore/player', { player_id: id, season: 2016 });

exports.fetchBoxscoresByGame = async id => {
  const boxscores = await fetch('/boxscore/player', { game_id: id }).catch(err => console.log(`error for boxscores ${id}: ${err}`));
  return boxscores ? boxscores.map(boxscore => mutateBoxscore(boxscore)) : null;
};

exports.gamesForDays = async days => {
  const dates = [];
  for (let i = 0; i < days; i++) {
    dates.push(moment().add(i, 'days').format('MM/DD/YYYY'));
  }
  const gamesByDay = await Promise.all(dates.map(date => fetch('/game', { date })));
  return gamesByDay.map(day => day.map(game => mutateGame(game)));
};