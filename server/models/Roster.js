const mongoose = require('mongoose');
const mongooseSocket = require('mongoose-socket.io');

module.exports = function(io) {

  const rosterSchema = new mongoose.Schema({
    league: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'League',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    effective: {
      type: Date,
      default: Date.now
    },
    players: [{
      type: Number,
      ref: 'Player'
    }],
  });

  rosterSchema.plugin(mongooseSocket, {
    io,
    prefix: 'roster',
    namespace: '',
    room: (doc) => [doc.league.id],
    events: {
      create: {
        populate: 'user players'
      }
    }
  });

  return mongoose.model('Roster', rosterSchema);
}