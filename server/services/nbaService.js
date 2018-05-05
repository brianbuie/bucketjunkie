const mongoose = require('mongoose');
const request = require('request');
const moment = require('moment');
const log = require('./logService');

const Player = mongoose.model('Player');
const Team = mongoose.model('Team');
const Game = mongoose.model('Game');

// Database methods

exports.player = async id => await Player.findOne({ _id: id }).populate('team');
exports.players = async (query = null) => await Player.find(query);
exports.team = async id => await Team.findOne({ _id: id });
exports.teams = async () => await Team.find({});


// API methods

const fetch = async (path, query) => {
  return new Promise((resolve, reject) => {
    const options = {
      method: 'POST',
      url: 'http://api.probasketballapi.com' + path,
      qs: query,
      headers: { 'cache-control': 'no-cache' },
    };
    options.qs.api_key = process.env.NBA_API_KEY;
    request(options, function (error, response, body) {
      if (error) return reject(error);
      if (response.statusCode != 200) return reject(response.statusCode);
      resolve(JSON.parse(body));
    });
  });
};

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

const mutateGameFinal = game => {
  game.final = false;
  return game;
}

const mutatePlayer = player => {
  player._id = player.id;
  player.team = player.team_id;
  player.name = player.player_name;
  return player;
};

const mutateTeam = team => {
  team._id = team.id;
  team.name = team.team_name;
  team.full_name = `${team.city} ${team.team_name}`;
  return team; 
};

exports.fetchAllPlayers = () => fetch('/player', {})
  .then(players => players.map(mutatePlayer))
  .catch(err => log.error(`Error fetching players: ${err}`));

exports.fetchAllTeams = () => fetch('/team', {})
  .then(teams => teams.map(mutateTeam))
  .catch(err => log.error(`Error fetching teams: ${err}`));

// Fetch all games and mark as not final
exports.fetchAllGamesNotFinal = () => fetch('/game', { season: 2017 }) // Todo: predict season
  .then(games => games.map(mutateGame).map(mutateGameFinal))
  .catch(err => log.error(`Error fetching games: ${err}`));

exports.fetchGame = id => fetch('/game', { game_id: id })
  .then(game => game ? mutateGame(game[0]) : null)
  .catch(err => log.error(`Error fetching game ${id}: ${err}`));

exports.fetchBoxscoresByGame = async id => {
  const boxscores = await fetch('/boxscore/player', { game_id: id })
  // errors needs to be caught by job manager to trigger a retry
  return boxscores ? boxscores.map(mutateBoxscore) : null;
};

exports.gamesForDays = async days => {
  const dates = [];
  for (let i = 0; i < days; i++) {
    dates.push(moment().add(i, 'days').format('MM/DD/YYYY'));
  }
  // disabled for offseason
  // const gamesByDay = await Promise.all(dates.map(date => fetch('/game', { date })));
  // return gamesByDay.map(day => day.map(mutateGame));

  // return no games for every day since this is disabled
  return dates.map(date => []);
};

exports.sortPlayers = (playersToSort, pointValues) => {
  let players = playersToSort.map(player => {
    const categories = ['ftm', 'fg2m', 'fg3m', 'reb', 'ast', 'blk', 'stl', 'to'];
    player.score = categories.reduce((sum, stat) => sum + (player.averages[stat] * pointValues[stat]), 0);
    return player;
  });
  players.sort((a,b) => {
    if (a.score < b.score) return 1;
    if (a.score > b.score) return -1;
    return 0;
  });
  return players;
};