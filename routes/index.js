const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { catchErrors } = require('../handlers/errorHandlers');

router.get('/', (req, res) => {
  res.render('index');
});

// users
router.get('/account/login', userController.loginForm);
router.get('/account/register', userController.registerForm);
router.get('/account/forgot-password', userController.forgotPassword);

module.exports = router;