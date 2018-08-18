const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const routes = require('./routes');
const session = require('express-session');
require('dotenv').config({ path: 'variables.env' });

app.use(
  session({
    secret: process.env.SECRET
  })
);

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', routes);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log('We have a server running on PORT: ' + port);
});
