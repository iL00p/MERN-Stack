const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/User');
const secretOrKey = require('./keys').secret;

const opts = {
  jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey
}

module.exports = passport => {
  passport.use( new JwtStrategy(opts, (jwt_payload, done) => {
    console.log("PAYLOAD::", jwt_payload);
    
    User.findById( jwt_payload._id ).then( user => {
      if ( user ) done( null, user );
      else done( null, false );
    }).catch( err => console.log("ERR::",err) );
  }))
};