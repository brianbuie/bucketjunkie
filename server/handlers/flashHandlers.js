/*
  Oops
  A Mild error handler that flashes the error
  redirects to given location or back by default
*/
exports.oops = (req, res, next) => {
  req.oops = (msg = 'Something went wrong.', loc = 'back') => {
    req.flash('error', msg);
    res.redirect(loc);
  }
  next();
};

/*
  greatJob
  The success version of "oops"
  redirects to given location or back by default
*/
exports.greatJob = (req, res, next) => {
  req.greatJob = (msg = 'Success!', loc = 'back') => {
    req.flash('success', msg);
    res.redirect(loc);
  }
  next();
};