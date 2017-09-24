const express = require('express');

const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const leagueController = require('../controllers/leagueController');
const { catchErrors } = require('../handlers/errorHandlers');

router.get('/', (req, res) => {
  res.render('index');
});

// users
router.get('/account/login', userController.loginForm);
router.post('/account/login', authController.login);
router.get('/account/forgot-password', userController.forgotPassword);
router.get('/account/register', userController.registerForm);
router.post('/account/register',
  userController.validateRegister,
  userController.register,
  authController.login
);
router.get('/account/logout', authController.logout);

router.get('/leagues', authController.isLoggedIn, leagueController.leagues);

module.exports = router;
