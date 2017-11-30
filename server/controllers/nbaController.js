const mongoose = require('mongoose');
const fs = require('fs');
const rosterService = require('../services/rosterService');
const nbaService = require('../services/nbaService');

const sortByScore = (a,b) => { 
  if (a.score < b.score) return 1; 
  if (a.score > b.score) return -1; 
  return 0; 
};

const appendPlayerScore = (player, pointValues) => { 
  const categories = ['ftm', 'fg2m', 'fg3m', 'reb', 'ast', 'blk', 'stl', 'to']; 
  player.score = categories.reduce((sum, stat) => sum + (player.averages[stat] * pointValues[stat]), 0); 
  return player; 
};

const appendUpcomingGames = (player, upcomingGames) => { 
  player.upcomingGames = upcomingGames.map(day => { 
    return day.filter(game => game.home === player.team || game.away === player.team)[0]; 
  }); 
  return player; 
};

const appendImage = player => { 
  const defaultImagePath = '/images/player-default.png'; 
  const playerImagePath = `/images/players/${player._id}.png`; 
  player.image = fs.existsSync(__dirname + `/../../client/public${playerImagePath}`) ? playerImagePath : defaultImagePath; 
  return player; 
};

exports.players = async (req, res) => {
  const [rawPlayers, upcomingGames] = await Promise.all([
    nbaService.players(),
    nbaService.gamesForDays(7)
  ]);
  let players = rawPlayers.map(player => {
    player = player.toObject ? player.toObject() : player; 
    // player = appendPlayerScore(player, req.league.pointValues);
    player = appendUpcomingGames(player, upcomingGames); 
    player = appendImage(player); 
    return player;
  });
  return res.greatJob({ players });
};

exports.teams = async (req, res) => {
  const teams = await nbaService.teams();
  return res.greatJob({ teams });
};