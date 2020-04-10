/* eslint-disable no-console */
const User = require('../models/User.js');

// const passportJwt = require('passport-jwt');
const jwt = require('jsonwebtoken');

const config = require('../config/passport');

const jwtOptions = config.jwtOptions;

const passport = require('passport');

module.exports.controller = (app) => {
  // register a user
  app.post('/users/register', (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    console.log(`Req body: ${JSON.stringify(req.body)}`);
    const newUser = new User({
      name,
      email,
      password,
    });
    User.createUser(newUser, (error, user) => {
      if (error) {
        res.status(422).json({
          message: 'Something went wrong. Please try again after some time!',
        });
        console.error(error);
      }
      res.send({ user });
    });
  });
  // login a user
  app.post('/users/login', passport.authenticate('local', { failureRedirect: '/users/login' }), (req, res) => {
    res.redirect('/');
  });
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
  // Jwt Strategy
  /* app.post('/users/login', (req, res) => {
    if (req.body.email && req.body.password) {
      const email = req.body.email;
      const password = req.body.password;
      User.getUserByEmail(email, (err, user) => {
        if (!user) {
          res.status(404).json({ message: 'The user does not exist' });
        } else {
          User.comparePassword(password, user.password, (error, isMatch) => {
            if (error) throw err;
            if (isMatch) {
              console.log(jwtOptions.secretOrKey);
              const payload = { id: user.id };
              const token = jwt.sign(payload, jwtOptions.secretOrKey);
              res.json({ message: 'ok', token });
            } else {
              res.status(401).json({ message: 'The password is incorrect!' });
            }
          });
        }
      });
    }
  }); */
};
