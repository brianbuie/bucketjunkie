const mongoose = require('mongoose');
const activityController = require('./activityController');
const rosterService = require('../services/rosterService');
const nbaService = require('../services/nbaService');

const Score = mongoose.model('Score');

const render = (initialState) => {
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
            window.__INITIAL_STATE__ = ${JSON.stringify(initialState)}
        </script>
        <script src="/dist/app.bundle.js" type="text/javascript"></script>
      </body>
    </html>
  `;
};

exports.dashboard = async (req, res) => {
  const [activity, rosters, scores, upcomingGames] = await Promise.all([
    activityController.getActivity(req, res),
    rosterService.getRosters(req.league),
    Score.getTotalScores(req.league._id),
    nbaService.gamesForDays(7)
  ]);
  const initialState = {
    league: req.league,
    user: req.user,
    activity: { items: activity },
    rosters,
    upcomingGames,
    scores
  };
  res
    .set('Content-Type', 'text/html')
    .status(200)
    .end(render(initialState));
};