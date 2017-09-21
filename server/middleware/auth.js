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
    models.Sessions.get({hash: req.cookies.shortlyid})
    .then((result) => {
      if (result) {
        req.session = {
          hash: result.hash
        };
        if (result.user) {
          req.session.user = result.user;
          req.session.userId = result.user.id;
        }
        next();
      } else {
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
      }
    })
    .catch((err) => {
      console.log('Error creating a session', err);
      next();  
    });
  }
};


module.exports.assignSession = (req, res, next) => {
  models.Users.get( {username: req.body.username})
  .then((result) => {
    return models.Sessions.update({hash: req.session.hash}, {userId: result.id});
  })
  .then(result => {
    // console.log('Updated session with userId', result);
    res.redirect('/');
  })
  .catch(err => console.log('error adding userId', err));
};

/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/

