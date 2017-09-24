require('dotenv').config({ path: 'variables.env' });
exports.liveReload = process.env.NODE_ENV === 'development' ? 'http://localhost:35729/livereload.js' : null;

const fs = require('fs');
exports.moment = require('moment');

exports.dump = obj => JSON.stringify(obj, null, 2);

exports.icon = name => fs.readFileSync(`./public/images/icons/${name}.svg`);

exports.siteName = 'Fantastic';

exports.menu = [
  { slug: '/players', title: 'Players' },
  { slug: '/this-week', title: 'This Week' },
  { slug: '/activity', title: 'Activity' },
  { slug: '/standings', title: 'Standings' },
];
