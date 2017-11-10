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
const io = require('socket.io')(http);

const sessionStore = require('./handlers/sessionHandler');
const passportSocketIo = require('passport.socketio');

io.use(passportSocketIo.authorize({
  secret: process.env.SECRET,
  key: process.env.KEY,
  store: sessionStore,
  success: (data, accept) => accept(null, true),
  fail: (data, message, error, accept) => {
    console.log('Failed to Authorize');
    accept(null, false);
  }
}));

io.sockets.on('connection', function(socket) {
  console.log(`User connected: ${socket.id}`);
  mongoose.connection.db.collection('sessions')
    .findOne({ _id: socket.request.sessionID })
    .then(result => {
      let session = JSON.parse(result.session);
      if (!session.league || !session.passport || !session.passport.user) return socket.disconnect();
      socket.join(session.league._id, () => {
        socket.nsp.to(session.league._id).emit('message', `${session.passport.user} Connected`);
      });
    });
});

http.listen(process.env.PORT, function() {
  console.log(`Listening on PORT ${process.env.PORT}`);
});