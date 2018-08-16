const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const appController = require('../controllers/appController');

// Middlewares
// Verify token
const verifyToken = (req, res, next) => {
  jwt.verify(req.session.token, process.env.SECRET, (err) => {
    if (err) {
      res.redirect('/');
    } else {
      next();
    }
  });
};

// Get the home page with login field
router.get('/', (req, res) => {
  res.render('index');
});

router.get('/dashboard', verifyToken, (req, res) => {
  res.render('dashboard');
});

router.post('/login', (req, res) => {
  let token = jwt.sign(req.body, process.env.SECRET);
  req.session.token = token;
  res.redirect('/dashboard');
});

// Thumbnail API
router.post('/api/thumbnail', verifyToken, appController.fileResize);

module.exports = router;
