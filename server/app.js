const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const passport = require('passport');
const promisify = require('es6-promisify');
const flash = require('connect-flash');
const expressValidator = require('express-validator');
const routes = require('./routes/index');
const helpers = require('./helpers');
const errorHandlers = require('./handlers/errorHandlers');
const flashHandlers = require('./handlers/flashHandlers');
const jobManager = require('./jobs/jobManager');

jobManager.startup();

const User = mongoose.model('User');
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const app = express();

app.set('views', path.resolve(__dirname, '..', 'client/views'));
app.set('view engine', 'pug');

app.use(express.static(path.resolve(__dirname, '..', 'client/public')));

if (app.get('env') === 'development') {
  const proxy = require('proxy-middleware');
  const url = require('url');
  app.use('/dist', proxy(url.parse('http://localhost:8081/dist')));
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(expressValidator());

app.use(cookieParser());

app.use(session({
  secret: process.env.SECRET,
  key: process.env.KEY,
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use((req, res, next) => {
  res.locals.helpers = helpers;
  res.locals.req = req;
  res.locals.user = req.user;
  res.locals.ref = req.query.ref ? `?ref=${req.query.ref}` : '/'
  res.locals.flashes = req.flash();
  res.locals.currentPath = req.path;
  next();
});

app.use((req, res, next) => {
  req.login = promisify(req.login, req);
  next();
});

app.use(flashHandlers.oops);
app.use(flashHandlers.greatJob);

app.use('/', routes);

app.use(errorHandlers.notFound);
app.use(errorHandlers.flashValidationErrors);
if (app.get('env') === 'development') {
  app.use(errorHandlers.developmentErrors);
}
app.use(errorHandlers.productionErrors);

module.exports = app;
