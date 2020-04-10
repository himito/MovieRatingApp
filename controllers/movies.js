/* eslint-disable no-console */
const MovieSchema = require('../models/Movie.js');
const RatingSchema = require('../models/Rating.js');

const passport = require('passport');

module.exports.controller = (app) => {
  // fetch all movies
  // JWT authentication
  // app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
  app.get('/movies', (req, res) => {
    MovieSchema.find({}, 'name description release_year genre', (error, movies) => {
      if (error) { console.error(error); }
      res.send({
        movies,
      });
    });
  });

  // add new movie
  app.post('/movies', (req, res) => {
    const newMovie = new MovieSchema({
      name: req.body.name,
      description: req.body.description,
      release_year: req.body.release_year,
      genre: req.body.genre,
    });

    newMovie.save((error, movie) => {
      if (error) { console.error(error); }
      res.send(movie);
    });
  });

  // get a specific movie
  app.get('/movies/:id', (req, res) => {
    MovieSchema.findById(req.params.id, 'name description release_year genre', (error, movie) => {
      if (error) { console.error(error); }
      res.send(movie);
    });
  });

  // post a rating
  app.post('/movies/rate/:id', (req, res) => {
    const newRating = new RatingSchema({
      movie_id: req.params.id,
      user_id: req.body.user_id,
      rate: req.body.rate,
    });
    newRating.save((error, rating) => {
      if (error) { console.error(error); }
      res.send({
        movie_id: rating.movie_id,
        user_id: rating.user_id,
        rate: rating.rase,
      });
    });
  });
};
