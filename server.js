const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const fs = require('fs');
const passport = require('passport');
const serveStatic = require('serve-static');
const history = require('connect-history-api-fallback');
const session = require('express-session');
const config = require('./config/Config');
require('./config/passport');

const app = express();
const router = express.Router();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(cors());

// Configuration for express session
app.use(session({
  secret: config.SECRET,
  resave: true,
  saveUninitialized: true,
  cookie: { httpOnly: false },
}))
app.use(passport.initialize());
app.use(passport.session());

// connect to mongoDB
mongoose.connect(config.DB,function() {
    console.log('Connection has been made');
})
.catch(err => {
    console.error('App starting error:', err.stack);
    process.exit(1);
});

// include controllers
fs.readdirSync("controllers").forEach(function (file) {
    if(file.substr(-3) == ".js") {
        const route = require("./controllers/"+file)
        route.controller(app);
    }
})

app.use(history());
app.use(serveStatic(__dirname + "/dist"));

// Add a GET route to fetch current logged in user
router.get('/api/current_user', isLoggedIn, (req,res) => {
  console.log('accès ici');
  if (req.user) {
    res.send({ current_user: req.user })
  } else {
    res.status(403).send({ success: false, msg: 'Unauthorized' });
  }
})
// Check if user data is in the session
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
  console.log('error! auth failed');
}
// Logs out and destroy the session
router.get('/api/logout', (req, res) => {
  req.logout();
  res.send({ message: 'Logout successfull' });
});

router.get('/',function(req,res) {
    res.json({message: 'API initialized!'});
});


const port = process.env.API_PORT || 8081;
app.use('/',router);
app.listen(port, function() {
    console.log(`api running on port ${port}`);
});

