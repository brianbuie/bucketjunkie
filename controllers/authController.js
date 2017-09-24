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

exports.isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated()) {
    next();
    return;
  }
  req.flash('error', 'You must be logged in to do that.');
  res.redirect('/account/login');
}