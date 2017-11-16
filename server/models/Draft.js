const mongoose = require('mongoose');
const mongooseSocket = require('mongoose-socket.io');

module.exports = function(io) {

  const draftSchema = new mongoose.Schema({
    league: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'League',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    players: [{
      type: Number,
      ref: 'Player'
    }],
  });

  draftSchema.plugin(mongooseSocket, {
    io,
    prefix: 'draft',
    namespace: '',
    room: (doc) => doc.league.id,
    events: {
      create: {
        populate: 'user players'
      },
      update: {
        populate: 'user players'
      },
    },
    debug: true
  });

  return mongoose.model('Draft', draftSchema);
}