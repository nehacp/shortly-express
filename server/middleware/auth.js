const models = require('../models');
const Promise = require('bluebird');

module.exports.createSession = (req, res, next) => {
  if (!req.cookies['shortlyid']) {
    models.Sessions.create()
    .then((result) => models.Sessions.get({id: result.insertId}))
    .then(session => {
      req.session = { hash: session.hash };
      res.cookie('shortlyid', session.hash);
      next();  
    })
    .catch((err) => {
      console.log('Error creating a session', err);
      next();  
    });
  } else {
    req.session = {
      hash: req.cookies.shortlyid
    };
    next();
  }
};

// module.exports.assignSession = (req, res, next) => {
//   console.log('cookies in assign', req.cookies);
//   if (req.cookies['shortlyid']) {
//     console.log('Cookie ->', req.cookies);
//     req.session = {
//       hash: req.cookies.shortlyid
//     };
//     next();
//   } else {
//     console.log('no length cookie', req.cookies);
//     next();
//   }
// };

/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/

