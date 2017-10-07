const express = require('express');
const userController = require('../controllers/userController');
const leagueInfo = require('../controllers/leagueInfoCtrl');
const { catchErrors } = require('../handlers/errorHandlers');

const router = express.Router();

router.get('/public', catchErrors(leagueInfo.publicLeagues));

router.use(userController.isLoggedIn);
router.get('/', catchErrors(leagueInfo.myLeagues));
router.get('/create', leagueInfo.createLeagueForm);
router.post('/create', leagueInfo.validateLeague, catchErrors(leagueInfo.createLeague));

module.exports = router;