const mongoose = require('mongoose');
const fs = require('fs');
const rosterService = require('../services/rosterService');
const nbaService = require('../services/nbaService');

exports.players = async (req, res) => {
  const findQ = req.query.team ? { team: req.query.team } : {};
  const [allPlayers, teams, upcomingGames] = await Promise.all([
    nbaService.players(findQ),
    nbaService.teams(),
    nbaService.gamesForDays(7)
  ]);
  const rosters = req.league.drafting
    ? await rosterService.getDraft(req.league, req.user)
    : await rosterService.getRosters(req.league);
  const players = nbaService.sortPlayers(allPlayers, req.league.pointValues).slice(0, 49);
  return res.render('nba/players', { league: req.league, players, teams, rosters, upcomingGames, activeTeam: req.query.team });
};