const passport = require('passport');

exports.login = passport.authenticate('local', {
  failureRedirect: '/account/login',
  failureFlash: 'Try again',
  successRedirect: '/',
  successFlash: 'Logged In'
});

exports.logout = (req, res) => {
  req.logout();
  req.flash('success', 'logged out');
  res.redirect('/');
};