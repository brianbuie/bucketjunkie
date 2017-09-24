const passport = require('passport');

exports.login = passport.authenticate('local', {
  failureRedirect: '/account/login',
  failureFlash: 'Try again',
  successRedirect: '/',
  successFlash: 'Logged In'
});