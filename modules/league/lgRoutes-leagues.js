const express = require('express');
const userController = require('../user/userController');
const leagueController = require('./leagueController');
const { catchErrors } = require('../error/errorHandlers');

const router = express.Router();

router.get('/public', catchErrors(leagueController.publicLeagues));

router.use(userController.isLoggedIn);
router.get('/', catchErrors(leagueController.myLeagues));
router.get('/create', leagueController.createLeagueForm);
router.post('/create', catchErrors(leagueController.createLeague));

module.exports = router;
