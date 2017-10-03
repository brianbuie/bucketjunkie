const express = require('express');
const userController = require('../user/userController');
const leagues = require('./leaguesController');
const { catchErrors } = require('../error/errorHandlers');

const router = express.Router();

router.get('/public', catchErrors(leagues.publicLeagues));

router.use(userController.isLoggedIn);
router.get('/', catchErrors(leagues.myLeagues));
router.get('/create', leagues.createLeagueForm);
router.post('/create', catchErrors(leagues.createLeague));

module.exports = router;