const socketio = require('socket.io');
const sessionStore = require('./handlers/sessionHandler');
const passportSocketIo = require('passport.socketio');
const mongoose = require('mongoose');

exports.initialize = function(server) {
  io = socketio(server);

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
};