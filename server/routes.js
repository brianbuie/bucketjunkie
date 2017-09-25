const express = require('express');

const router = express.Router();
const userController = require('../modules/user/userController');
const leagueController = require('../modules/league/leagueController');
const { catchErrors } = require('../modules/error/errorHandlers');

router.get('/', (req, res) => {
  res.render('index', { title: 'Home' });
});

// users
router.get('/account', userController.isLoggedIn, userController.account);
router.get('/account/forgot-password', userController.forgotPasswordForm);
router.post('/account/forgot-password', catchErrors(userController.createResetToken));
router.get('/account/login', userController.loginForm);
router.post('/account/login', userController.login);
router.get('/account/logout', userController.logout);
router.get('/account/register', userController.registerForm);
router.post('/account/register', userController.validateRegister, userController.register, userController.login);
router.get('/account/reset-password/:token', catchErrors(userController.resetPasswordForm));
router.post('/account/reset-password/:token', userController.validatePasswordReset, catchErrors(userController.updatePassword));

// leagues
router.get('/leagues', userController.isLoggedIn, leagueController.leagues);

module.exports = router;
