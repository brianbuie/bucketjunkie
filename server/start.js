const mongoose = require('mongoose');

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', 'variables.env') });

mongoose.connect(process.env.DATABASE, {
  useMongoClient: true
});
mongoose.Promise = global.Promise;
mongoose.connection.on('error', (err) => {
  console.error(`🚫 → ${err.message}`);
});

require('../modules/league/leagueModel');
require('../modules/user/userModel');
require('../modules/activity/activityModel');
require('../modules/nba/playerModel');
require('../modules/nba/teamModel');
require('../modules/nba/gameModel');

const app = require('./app');

app.set('port', process.env.PORT || 7777);
const server = app.listen(app.get('port'), () => {
  console.log(`Express running → PORT ${server.address().port}`);
});
