const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const routes = require('./routes');
const session = require('express-session');
const validator = require('express-validator');
require('dotenv').config({ path: 'variables.env' });

// Sessions
app.use(
  session({
    secret: process.env.SECRET
  })
);
// Validator
app.use(validator());

// View engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Public folder for styles and uploads
app.use(express.static(path.join(__dirname, 'public')));

// Body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Routes
app.use('/', routes);

// Start the server
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log('We have a server running on PORT: ' + port);
});
