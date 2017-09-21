const parseCookies = (req, res, next) => {
  if (req.headers.cookie) {
    req.cookies = req.headers.cookie.split('; ').reduce((result, property) => {
      let values = property.match(/(.+)=(.+);?/);
      result[values[1]] = values[2];
      return result;
    }, {});
  } else {
    req.cookies = {};
  }
  next();
};

module.exports = parseCookies;