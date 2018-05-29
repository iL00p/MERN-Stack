const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const User = require('../models/User');
const secretOrKey = require('./keys').secret;

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey,
};

module.exports = (passport) => {
  passport.use(new JwtStrategy(opts, (jwtPayload, done) => {
    User.findById(jwtPayload._id).then((user) => {
      if (user) done(null, user);
      else done(null, false);
    }).catch(err => console.log('ERR::', err));
  }));
};
