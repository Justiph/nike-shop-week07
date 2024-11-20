const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Route to render the register page (GET request)
router.get('/register', (req, res) => {
  res.render('register'); // This renders the 'register.ejs' view
});

// Route to render the login page (GET request)
router.get('/login', (req, res) => {
  res.render('login'); // This renders the 'login.ejs' view
});

// Route for handling the registration form submission (POST request)
router.post('/register', authController.register);

// Route for handling the login form submission (POST request)
router.post('/login', authController.login);

module.exports = router;
