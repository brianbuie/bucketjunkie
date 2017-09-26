const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.resolve(__dirname, '..', 'variables.env') });
exports.moment = require('moment');

exports.liveReload = process.env.WEBPACK_LIVE_RELOAD === "true" ? 'http://localhost:35729/livereload.js' : null;

exports.dump = obj => JSON.stringify(obj, null, 2);

exports.icon = name => fs.readFileSync(`../public/images/icons/${name}.svg`);

exports.siteName = 'Fantastic';

exports.menu = [
  { slug: '/leagues', title: 'Leagues' },
  { slug: '/leagues/create', title: 'Create League' }
];
