const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const appController = require('../controllers/appController');

// Middlewares
// Verify token
const verifyToken = (req, res, next) => {
  jwt.verify(req.session.token, process.env.SECRET, (err) => {
    if (err) {
      res.sendStatus(403);
    } else {
      next();
    }
  });
};

// Get the home page with login field
router.get('/', (req, res) => {
  res.render('index');
});

router.get('/dashboard', (req, res) => {
  res.render('dashboard');
});

// Login route
router.post('/login', (req, res) => {
  // Sanitizing the input fields
  req.sanitizeBody('username');
  req.checkBody('username', 'Username should not be empty').notEmpty();
  req.checkBody('password', 'Password should not be empty!').notEmpty();

  let errors = req.validationErrors();
  // Check for errors
  if (errors) {
    res.redirect('back');
    console.log(errors);
    return;
  }
  // Issue the token when there is no validation errors
  let token = jwt.sign(req.body, process.env.SECRET);
  req.session.token = token;
  req.session.username = req.body.username;
  res.redirect('/thumbnail');
});

// Thumbnail page
router.get('/thumbnail', (req, res) => {
  res.render('thumbnail');
});

// JSON patch page
router.get('/jsonpatch', (req, res) => {
  res.render('jsonpatch');
});

// Thumbnail API
router.post('/api/thumbnail', verifyToken, appController.fileResize);

// JSON Patch API
router.post('/api/patch', verifyToken, appController.jsonPatch);

module.exports = router;
