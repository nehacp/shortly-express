const models = require('../models');
const Promise = require('bluebird');

module.exports.createSession = (req, res, next) => {
  console.log('length', Object.keys(req.cookies).length);
  if (!Object.keys(req.cookies).length) {
    models.Sessions.create()
    .then((result) => {
      console.log('RECEIVED RESULTS', result);
      req.session = result;
      next();
    })
    .catch((err) => {
      console.log('ERROOORR', err);
      next();
    });  
  } else {
    next();
  }
};


/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/

