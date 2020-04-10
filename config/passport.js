const UserModel = require('../models/User');
const config = require('./Config');
const passport = require('passport');

// Local Strategy
const LocalStrategy = require('passport-local').Strategy;

passport.use('local', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
}, (email, password, done) => {
  UserModel.getUserByEmail(email, (err, user) => {
    if (err) { return done(err); }
    if (!user) { return done(null, false); }
    UserModel.comparePassword(password, user.password, (error, isMatch) => {
      if (isMatch) {
        return done(null, user);
      }
      return done(null, false);
    });
    return true;
  });
}));

// JWT Strategy
/*
const jwt = require('jsonwebtoken');
const passportJwt = require('passport-jwt');

const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt; // extract payload data in jwt token 

const jwtOptions = {}; 
jwtOptions.secretOrKey = config.SECRET;
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');

passport.use('jwt', new JwtStrategy (jwtOptions, (jwtPayload, cb) => {
  UserModel.findOne({ _id: jwtPayload.id}, (err, user) => {
    if (err) {
      return cb(err, false);
    }
    if (user) {
      cb(null, user);
    } else {
      cb(null, false);
    }
  });
}));

module.exports.jwtOptions = jwtOptions;
*/

