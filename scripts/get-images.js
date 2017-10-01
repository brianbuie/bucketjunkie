require('dotenv').config({ path: __dirname + '/../variables.env' });
const fs = require('fs');
const path = require('path');
const request = require('request');

const players = JSON.parse(fs.readFileSync(__dirname + '/data/players.json', 'utf-8'));
const teams = JSON.parse(fs.readFileSync(__dirname + '/data/teams.json', 'utf-8'));

function getPlayerImages(players) {
  players.forEach(player => {
    const foreign = `https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/${player.id}.png`;
    const local = path.resolve(__dirname, '..', `public/images/players/${player.id}.png`);
    const r = request(foreign);
    r.on('response', response => {
      if(response.statusCode === 200) {
        return r.pipe(fs.createWriteStream(local));
      }
      console.log(`No image for ${player.player_name}`);
    });
  });
}

function getTeamImages(teams) {
  teams.forEach(team => {
    const foreign = `http://i.cdn.turner.com/nba/nba/assets/logos/teams/primary/web/${team.abbreviation}.svg`;
    const local = path.resolve(__dirname, '..', `public/images/teams/${team.abbreviation}.svg`);
    const r = request(foreign);
    r.on('response', response => {
      if(response.statusCode === 200) {
        return r.pipe(fs.createWriteStream(local));
      }
      console.log(`No image for ${team.abbreviation}`);
    });
  });
}

if (process.argv.includes('--players')) getPlayerImages(players);
if (process.argv.includes('--teams')) getTeamImages(teams);
