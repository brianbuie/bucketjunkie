const express = require('express');
const router = express.Router();
const userController = require('../modules/user/userController');
const leagueController = require('../modules/league/leagueController');
const { catchErrors } = require('../modules/error/errorHandlers');

router.get('/', (req, res) => {
  res.render('index');
});

// users
router.get('/account/login', userController.loginForm);
router.post('/account/login', userController.login);
router.get('/account/forgot-password', userController.forgotPassword);
router.get('/account/register', userController.registerForm);
router.post('/account/register',
  userController.validateRegister,
  userController.register,
  userController.login
);
router.get('/account/logout', userController.logout);

// leagues
router.get('/leagues', userController.isLoggedIn, leagueController.leagues);

module.exports = router;
