const express = require('express');
const router = express.Router();
const userController = require('../user/userController');
const leagueController = require('./leagueController');
const { catchErrors } = require('../error/errorHandlers');

router.get('/', catchErrors(leagueController.myLeagues));
router.get('/public', catchErrors(leagueController.publicLeagues));
router.get('/create', userController.isLoggedIn, leagueController.createLeagueForm);
router.post('/create', userController.isLoggedIn, catchErrors(leagueController.createLeague));
router.get('/:id', userController.isLoggedIn, catchErrors(leagueController.leagueOverview));
router.get('/:id/edit', userController.isLoggedIn, leagueController.editLeagueForm);
router.post('/:id/edit', userController.isLoggedIn, catchErrors(leagueController.updateLeague));
router.get('/:id/join', userController.isLoggedIn, catchErrors(leagueController.joinLeague));
router.post('/:id/users', userController.isLoggedIn, catchErrors(leagueController.updateUser));

module.exports = router;