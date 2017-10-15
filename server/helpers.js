const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.resolve(__dirname, '..', 'variables.env') });
exports.moment = require('moment');

exports.isProd = process.env.NODE_ENV === 'production';

exports.dump = obj => JSON.stringify(obj, null, 2);

exports.teamLogo = abbreviation => fs.readFileSync(__dirname + `/../client/public/images/teams/${abbreviation}.svg`);

exports.pointValues = [
  { attr: 'ftm', name: 'Free Throw made' },
  { attr: 'fg2m', name: '2-point field goal' },
  { attr: 'fg3m', name: '3-point field goal' },
  { attr: 'reb', name: 'Rebound' },
  { attr: 'ast', name: 'Assist' },
  { attr: 'blk', name: 'Block' },
  { attr: 'stl', name: 'Steal' },
  { attr: 'to', name: 'Turnover' },
];

exports.playerImage = id => {
  const defaultImagePath = '/images/player-default.png';
  const playerImagePath = `/images/players/${id}.png`;
  if (fs.existsSync(__dirname + `/../client/public${playerImagePath}`)) return playerImagePath;
  return defaultImagePath;
};

exports.userPhoto = user => user.photo ? `/images/uploads/${user.photo}` : '/images/user-default.png';
