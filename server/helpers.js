const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', 'variables.env') });

exports.liveReload = process.env.NODE_ENV === 'development' ? 'http://localhost:35729/livereload.js' : null;

const fs = require('fs');
exports.moment = require('moment');

exports.dump = obj => JSON.stringify(obj, null, 2);

exports.icon = name => fs.readFileSync(`../public/images/icons/${name}.svg`);

exports.siteName = 'Fantastic';

exports.menu = [
  { slug: '/leagues', title: 'Leagues' },
  { slug: '/leagues/create', title: 'Create League' }
];
