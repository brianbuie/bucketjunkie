const mongoose = require('mongoose');
const activityController = require('./activityController');
const rosterService = require('../services/rosterService');
const nbaService = require('../services/nbaService');
const fs = require('fs');

const Score = mongoose.model('Score');
const League = mongoose.model('League');

const render = (state) => {
  return `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta http-equiv="x-ua-compatible" content="ie-edge">
        <title>BucketJunkie</title>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Maven+Pro:400,500,700">
        ${ process.env.NODE_ENV === 'production' ? '<link rel="stylesheet" href="/dist/app.css">' : ''}
        <link rel="shortcut icon" type="image/png" href="/images/icons/favicon.ico">
      </head>
      <body>
        <div id="app"></div>
        <script>
            window.__INITIAL_STATE__ = ${JSON.stringify(state)}
        </script>
        <script src="/dist/app.bundle.js" type="text/javascript"></script>
      </body>
    </html>
  `;
};

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
}

exports.dashboard = async (req, res) => {

  let state = {};
  let openLeaguesQ = { public: true, open: true };

  if (req.user) {
    state.myLeagues = await League.find({ members: req.user });
    state.user = req.user;
    openLeaguesQ.members = { $ne: req.user._id };
    openLeaguesQ.blocked = { $ne: req.user._id };
  }

  state.openLeagues = await League.find(openLeaguesQ).limit(10);

  if (req.league) {
    state.league = req.league;

    const [activity, rawScores, upcomingGames, playersRaw, teams] = await Promise.all([
      activityController.getActivity(req, res),
      Score.getTotalScores(req.league._id),
      nbaService.gamesForDays(7),
      nbaService.players(),
      nbaService.teams()
    ]);

    const rosters = req.league.drafting
      ? [await rosterService.getDraft(req.league, req.user)]
      : await rosterService.getRosters(req.league);

    const scores = req.league.members.map(user => {
      let matchedScore = rawScores.filter(score => score._id == user.id)[0];
      return matchedScore || { _id: user.id, score: 0 };
    });

    let players = playersRaw.map(player => {
      player = player.toObject ? player.toObject() : player;
      player = appendPlayerScore(player, req.league.pointValues);
      player = appendUpcomingGames(player, upcomingGames);
      player = appendImage(player);
      return player;
    });

    players.sort(sortByScore);

    state.activity = { items: activity };
    state.rosters = rosters;
    state.scores = scores;
    state.players = players;
    state.teams = teams;
  }

  if (req.headers.accept === 'application/json') {
    return res.status(200).json({ state });
  }

  return res.set('Content-Type', 'text/html').status(200).end(render(state));
};