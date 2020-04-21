/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
const MovieSchema = require('../models/Movie.js');
const RatingSchema = require('../models/Rating.js');

// const passport = require('passport');

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

  // get a specific movie
  app.get('/movies/:id', (req, res) => {
    MovieSchema.findById(req.params.id, 'name description release_year genre', (error, movie) => {
      if (error) { console.error(error); }
      res.send(movie);
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

  // Update a movie
  app.put('/movies/:id', (req, res) => {
    MovieSchema.findById(req.params.id, 'name description release_year genre', (error, movie) => {
      if (error) { console.error(error); }

      movie.name = req.body.name;
      movie.description = req.body.description;
      movie.release_year = req.body.release_year;
      movie.genre = req.body.genre;

      // eslint-disable-next-line no-shadow
      movie.save((err, movie) => {
        if (err) { console.log(err); }
        res.send(movie);
      });
    });
  });

  // Delete a movie
  app.delete('/movies/:id', (req, res) => {
    console.log('App delete appelé ! \n');
    MovieSchema.deleteOne({ _id: req.params.id }, (error, _output) => {
      if (error) { console.error(error); }
      // res.send(output === 1 ? { msg: 'success' } : { msg: 'error' });
      else {
        console.log('successfully deleted');
        res.redirect('/');
      }
    });
  });
};
