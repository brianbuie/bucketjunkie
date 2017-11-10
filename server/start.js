// Server
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

// Database
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
require('./models/Activity')(io);
require('./models/Player');
require('./models/Team');
require('./models/Game');
require('./models/Roster')(io);
require('./models/Draft');
require('./models/League');
require('./models/Score');
require('./models/Box');

// Server listen
server.listen(process.env.PORT, function() {
  console.log(`Listening on PORT ${process.env.PORT}`);
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
app.set('views', path.resolve(__dirname, '..', 'client/views'));
app.set('view engine', 'pug');
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
const sessionStore = require('./handlers/sessionHandler');
app.use(require('express-session')({
  secret: process.env.SECRET,
  key: process.env.KEY,
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
}));
app.use(passport.initialize());
app.use(passport.session());

// flash handling
app.use(require('connect-flash')());
const flashHandlers = require('./handlers/flashHandlers');
app.use(flashHandlers.oops);
app.use(flashHandlers.greatJob);

// locals for pug
const helpers = require('./helpers');
app.use((req, res, next) => {
  res.locals.helpers = helpers;
  res.locals.user = req.user;
  res.locals.ref = req.query.ref ? `?ref=${req.query.ref}` : '/'
  res.locals.flashes = req.flash();
  res.locals.currentPath = req.path;
  next();
});

const promisify = require('es6-promisify');
app.use((req, res, next) => {
  req.login = promisify(req.login, req);
  next();
});

const routes = require('./routes/index');
app.use('/', routes);

const errorHandlers = require('./handlers/errorHandlers');
app.use(errorHandlers.notFound);
// app.use(errorHandlers.flashValidationErrors);
if (app.get('env') === 'development') {
  app.use(errorHandlers.developmentErrors);
}
app.use(errorHandlers.productionErrors);

// io
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
  mongoose.connection.db.collection('sessions')
    .findOne({ _id: socket.request.sessionID })
    .then(result => {
      let session = JSON.parse(result.session);
      if (!session.league || !session.passport || !session.passport.user) return socket.disconnect();
      socket.join(session.league._id, () => {
        console.log(`${session.passport.user} connected to ${session.league.name} socket`);
        socket.nsp.to(session.league._id).emit('message', `${session.passport.user} connected`);
      });
    });
});