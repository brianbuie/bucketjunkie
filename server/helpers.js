const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.resolve(__dirname, '..', 'variables.env') });
const moment = require('moment');

exports.moment = moment;

exports.isProd = process.env.NODE_ENV === 'production';

exports.dump = obj => JSON.stringify(obj, null, 2);

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

exports.teamImage = id => {
  const teams = {
    '1610612737': 'ATL',
    '1610612738': 'BOS',
    '1610612739': 'CLE',
    '1610612740': 'NOP',
    '1610612741': 'CHI',
    '1610612742': 'DAL',
    '1610612743': 'DEN',
    '1610612744': 'GSW',
    '1610612745': 'HOU',
    '1610612746': 'LAC',
    '1610612747': 'LAL',
    '1610612748': 'MIA',
    '1610612749': 'MIL',
    '1610612750': 'MIN',
    '1610612751': 'BKN',
    '1610612752': 'NYK',
    '1610612753': 'ORL',
    '1610612754': 'IND',
    '1610612755': 'PHI',
    '1610612756': 'PHX',
    '1610612757': 'POR',
    '1610612758': 'SAC',
    '1610612759': 'SAS',
    '1610612760': 'OKC',
    '1610612761': 'TOR',
    '1610612762': 'UTA',
    '1610612763': 'MEM',
    '1610612764': 'WAS',
    '1610612765': 'DET',
    '1610612766': 'CHA',
  }
  return `/images/teams/${teams[id.toString()]}.svg`;
}

exports.userPhoto = user => user.photo ? `/images/uploads/${user.photo}` : '/images/user-default.png';
