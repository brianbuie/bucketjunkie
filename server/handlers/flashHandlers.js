/*
  Oops
  A Mild error handler that flashes the error
  redirects to given location or back by default
*/
exports.oops = (req, res, next) => {
  req.oops = (message = 'Something went wrong.', loc = 'back') => {
    if (req.headers.accept === 'application/json') {
      return res.status(500).json({ message });
    }
    req.flash('error', message);
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
  req.greatJob = (message = 'Success!', loc = 'back') => {
    if (req.headers.accept === 'application/json') {
      return res.status(200).json({ message });
    }
    req.flash('success', message);
    res.redirect(loc);
  }
  next();
};