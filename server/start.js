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

require('./models/User');
require('./models/Activity');
require('./models/Player');
require('./models/Team');
require('./models/Game');
require('./models/Roster');
require('./models/Draft');
require('./models/League');
require('./models/Score');
require('./models/Box');

const app = require('./app');
const http = require('http').Server(app);
const io = require('./io').initialize(http);

http.listen(process.env.PORT, function() {
  console.log(`Listening on PORT ${process.env.PORT}`);
});