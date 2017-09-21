const models = require('../models');
const Promise = require('bluebird');

module.exports.createSession = (req, res, next) => {
  if (!req.cookies['shortlyid']) {
    models.Sessions.create()
    .then((result) => models.Sessions.get({id: result.insertId}))
    .then(session => {
      req.session = { hash: session.hash };
      res.cookie('shortlyid', session.hash);
    }).then(() => models.Users.get({username: req.body.username}))
    .then((userInfo) => {
      if (userInfo) {
        req.session.user = {
          username: userInfo.username
        };
        req.session.userId = userInfo.id;
        next();
      } else {
        next();
      }
    })
    .catch((err) => {
      console.log('Error creating a session', err);
      next();  
    });
  } else {
    //console.log('here with cookie', req.body.username);
    req.session = {
      hash: req.cookies.shortlyid
    };
    models.Sessions.get({hash: req.cookies.shortlyid})
    .then((result) => {
      if (result) {
        req.session.userId = result.userId;
        models.Users.get({id: result.userId})
        .then((userInfo) => {
          if (userInfo) {
            req.session.user = {
              username: userInfo.username
            };
            next();
          } else {
            next();
          }
        });
      } else {
        next();
      }
    })
    .catch((err) => {
      console.log('Error creating a session', err);
      next();  
    });
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

