const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.resolve(__dirname, '..', 'variables.env') });
exports.moment = require('moment');

exports.liveReload = process.env.WEBPACK_LIVE_RELOAD === 'true' ? 'http://localhost:35729/livereload.js' : null;

exports.dump = obj => JSON.stringify(obj, null, 2);

exports.teamLogo = abbreviation => fs.readFileSync(__dirname + `/../public/images/teams/${abbreviation}.svg`);

exports.siteName = 'Fantastic';

exports.menu = [
  { slug: '/leagues', title: 'My Leagues' },
  { slug: '/leagues/public', title: 'Join' },
  { slug: '/leagues/create', title: 'Create' },
  { slug: '/nba', title: 'NBA' }
];

exports.playerImage = id => {
  const defaultImagePath = '/images/player-default.png';
  const playerImagePath = `/images/players/${id}.png`;
  if (fs.existsSync(__dirname + `/../public${playerImagePath}`)) return playerImagePath;
  return defaultImagePath;
};
