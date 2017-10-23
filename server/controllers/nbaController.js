const mongoose = require('mongoose');
const fs = require('fs');
const rosterService = require('../services/rosterService');
const nbaService = require('../services/nbaService');

const Team = mongoose.model('Team');
const Player = mongoose.model('Player');
const Draft = mongoose.model('Draft');
const League = mongoose.model('League');

const sortPlayers = (playersToSort, req) => {
  let pointValues = { ftm: 1, fg2m: 2, fg3m: 3, reb: 1, ast: 1, blk: 1, stl: 1, to: -1 };
  if (req.league) pointValues = req.league.pointValues;
  players = playersToSort.map(player => {
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

exports.players = async (req, res) => {
  const findQ = {};
  if (req.query.team) findQ.team = req.query.team;
  const [allPlayers, teams, upcomingGames] = await Promise.all([
    Player.find(findQ),
    Team.find({}),
    nbaService.gamesForDays(7)
  ]);
  const rosters = req.league.drafting
    ? await rosterService.getDraft(req.league, req.user)
    : await rosterService.getRosters(req.league);
  const players = sortPlayers(allPlayers, req).slice(0, 49);
  return res.render('nba/players', { title: 'Top Players', league: req.league, players, teams, rosters, upcomingGames, activeTeam: req.query.team });
};