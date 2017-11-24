// Server
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

// Database
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', 'variables.env') });
mongoose.connect(process.env.DATABASE, { useMongoClient: true });
mongoose.Promise = global.Promise;
mongoose.connection.on('error', err => console.error(`🚫 → ${err.message}`));

// Models
require('./models/User');
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
  secret: process.env.SECRET,
  key: process.env.KEY,
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

const responseHandlers = require('./handlers/responseHandlers');
app.use(responseHandlers.greatJob);
app.use(responseHandlers.oops);

app.use('/api', require('./api'));
app.use((req, res) => res.set('Content-Type', 'text/html').status(200).end(`
  <!doctype html>
  <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <meta http-equiv="x-ua-compatible" content="ie-edge">
      <title>BucketJunkie</title>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Maven+Pro:400,500,700">
      ${ process.env.NODE_ENV === 'production' ? '<link rel="stylesheet" href="/dist/app.css">' : ''}
      <link rel="shortcut icon" type="image/png" href="/images/icons/favicon.ico">
    </head>
    <body>
      <div id="app"></div>
      <script>
          window.__INITIAL_STATE__ = ${JSON.stringify({
            user: req.user,
            league: req.session.league
          })}
      </script>
      <script src="/dist/app.bundle.js" type="text/javascript"></script>
    </body>
  </html>
`));


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