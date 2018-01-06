const mongoose = require('mongoose');
const mongooseSocket = require('mongoose-socket.io');

module.exports = function(io) {
  
  const activitySchema = new mongoose.Schema({
    league: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'League',
      required: 'Please supply a league',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    category: String,
    message: {
      type: String,
      trim: true,
      required: 'Please supply a message',
    },
    date: {
      type: Date,
      default: Date.now,
    },
    hidden: {
      type: Boolean,
      default: false,
    },
  });

  activitySchema.plugin(mongooseSocket, {
    io,
    prefix: 'activity',
    namespace: '',
    room: (doc) => doc.league.id || doc.league,
    events: {
      create: {
        populate: 'user'
      }
    },
    debug: process.env.DEBUG
  });

  return mongoose.model('Activity', activitySchema);

}
