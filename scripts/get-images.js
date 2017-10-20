require('dotenv').config({ path: __dirname + '/../variables.env' });
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const request = require('request');

mongoose.connect(process.env.DATABASE, {
  useMongoClient: true
});
mongoose.Promise = global.Promise;
mongoose.connection.on('error', (err) => {
  console.error(`🚫 → ${err.message}`);
});

const Player = require('../server/models/Player');

// ends up timing out, too lazy to fix right now.
async function getPlayerImages() {
  const players = await Player.find({});
  players.forEach(player => {
    const foreign = `https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/${player._id}.png`;
    const local = path.resolve(__dirname, '..', `client/public/images/players/${player._id}.png`);
    const r = request(foreign);
    r.on('response', response => {
      if(response.statusCode === 200) {
        return r.pipe(fs.createWriteStream(local));
      }
      console.log(`No image for ${player.name}`);
    });
  });
}

function getTeamImages() {
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
  };
  Object.keys(teams).forEach(id => {
    const abbreviation = teams[id];
    const foreign = `http://i.cdn.turner.com/nba/nba/assets/logos/teams/primary/web/${abbreviation}.svg`;
    const local = path.resolve(__dirname, '..', `client/public/images/teams/${id}.svg`);
    const r = request(foreign);
    r.on('response', response => {
      if(response.statusCode === 200) {
        return r.pipe(fs.createWriteStream(local));
      }
      console.log(`No image for ${abbreviation}`);
    });
  });
}

if (process.argv.includes('--players')) getPlayerImages();
if (process.argv.includes('--teams')) getTeamImages();
