exports.oops = (req, res, next) => {
  res.oops = (data = "Error!") => {
    let payload = {};
    if (typeof data === 'string') {
      payload.message = data;
    } else {
      payload = data;
    }
    return res.status(500).json(payload);
  }
  next();
}

exports.greatJob = (req, res, next) => {
  res.greatJob = (data = "Success!") => {
    let payload = {};
    if (typeof data === 'string') {
      payload.message = data;
    } else {
      payload = data;
    }
    return res.status(200).json(payload);
  }
  next();
}