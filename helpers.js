require('dotenv').config({ path: 'variables.env' });
exports.devScript = process.env.NODE_ENV === 'development' ? 'http://localhost:35729/livereload.js' : null;

const fs = require('fs');
exports.moment = require('moment');

exports.dump = obj => JSON.stringify(obj, null, 2);

exports.icon = name => fs.readFileSync(`./public/images/icons/${name}.svg`);

exports.siteName = 'NBA Fantasy';

exports.menu = [
  { slug: '/stores', title: 'Stores', icon: 'store' },
  { slug: '/tags', title: 'Tags', icon: 'tag' },
  { slug: '/top', title: 'Top', icon: 'top' },
  { slug: '/add', title: 'Add', icon: 'add' },
  { slug: '/map', title: 'Map', icon: 'map' },
];
