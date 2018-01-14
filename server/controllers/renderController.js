const nbaService = require('../services/nbaService');
const fs = require('fs');
const objectAssignDeep = require('object-assign-deep');

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

exports.initialState = async (req, res) => {
  const [teams, rawPlayers, upcomingGames] = await Promise.all([
    nbaService.teams(),
    nbaService.players(),
    nbaService.gamesForDays(7)
  ]);

  let players = rawPlayers.map(player => {
    player = player.toObject ? player.toObject() : player; 
    player = appendUpcomingGames(player, upcomingGames); 
    player = appendImage(player); 
    return player;
  });

  const state = {
    user: req.user,
    league: req.session.league,
    teams,
    players
  };

  const initialState = req.session.initialState
    ? objectAssignDeep(state, req.session.initialState)
    : state;

  return res.set('Content-Type', 'text/html').status(200).end(`
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
            window.__INITIAL_STATE__ = ${JSON.stringify(initialState)}
        </script>
        <script src="/dist/app.bundle.js" type="text/javascript"></script>
      </body>
    </html>
  `);
};

exports.updateSessionInitialState = (req, res) => {
  req.session.initialState = req.session.initialState 
    ? objectAssignDeep(req.session.initialState, req.body) 
    : req.body;
  return res.greatJob(req.session.initialState);
};