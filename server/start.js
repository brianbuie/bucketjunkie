// Config & logging
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', 'variables.env') });
const log = require('./services/logService');

// Server
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

// Database
const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE, { useMongoClient: true });
mongoose.Promise = global.Promise;
mongoose.connection.on('error', err => log.error(`MongoError - ${err.message}`));

// Models
require('./models/User')(io);
require('./models/Activity')(io);
require('./models/Player');
require('./models/Team');
require('./models/Game');
require('./models/Roster')(io);
require('./models/Draft')(io);
require('./models/League')(io);
require('./models/Score');
require('./models/Box');

// Server listen
server.listen(process.env.PORT, function() {
  log.success({ msg: `Express listening on port ${process.env.PORT}`, force: true });
});

// Automatic jobs
const jobManager = require('./jobs/jobManager');
jobManager.startup();

// Passport setup
const passport = require('passport');
const User = mongoose.model('User');
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Static files
app.use(express.static(path.resolve(__dirname, '..', 'client/public')));

// Webpack DevServer proxy
if (app.get('env') === 'development') {
  const proxy = require('proxy-middleware');
  const url = require('url');
  app.use('/dist', proxy(url.parse(`http://localhost:${process.env.WEBPACK_PORT}/dist`)));
}

// Request handling
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(cookieParser());

// Session handling
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const sessionStore = new MongoStore({ mongooseConnection: mongoose.connection });
app.use(session({
  secret: process.env.SESSION_SECRET,
  key: process.env.SESSION_KEY,
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
}));
app.use(passport.initialize());
app.use(passport.session());

// promisify Login
const promisify = require('es6-promisify');
app.use((req, res, next) => {
  req.login = promisify(req.login, req);
  next();
});

// API response
const responseHandlers = require('./handlers/responseHandlers');
app.use(responseHandlers.greatJob);
app.use(responseHandlers.oops);
app.use('/api', require('./api'));

// React view for everything else
const { catchErrors } = require('./handlers/errorHandlers');
const render = require('./controllers/renderController');
app.use(catchErrors(render.initialState));


// io
const passportSocketIo = require('passport.socketio');
io.use(passportSocketIo.authorize({
  secret: process.env.SESSION_SECRET,
  key: process.env.SESSION_KEY,
  store: sessionStore,
  success: (data, accept) => accept(null, true),
  fail: (data, message, error, accept) => {
    log.status('socket.io connection failed to authorize, closing connection.');
    accept(null, false);
  }
}));
io.sockets.on('connection', function(socket) {
  mongoose.connection.db.collection('sessions')
    .findOne({ _id: socket.request.sessionID })
    .then(result => {
      if (!result) return;
      let session = JSON.parse(result.session);
      if (!session.league || !session.passport || !session.passport.user) return socket.disconnect();
      socket.join(session.league._id, () => {
        log.success(`${session.passport.user} connected to ${session.league.name} socket`);
        socket.nsp.to(session.league._id).emit('message', `${session.passport.user} connected`);
      });
    });
});