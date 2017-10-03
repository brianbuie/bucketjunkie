const express = require('express');
const userController = require('../../user/userController');
const leagueInfo = require('../info/leagueInfoCtrl');
const { catchErrors } = require('../../error/errorHandlers');

const router = express.Router();

router.get('/public', catchErrors(leagueInfo.publicLeagues));

router.use(userController.isLoggedIn);
router.get('/', catchErrors(leagueInfo.myLeagues));
router.get('/create', leagueInfo.createLeagueForm);
router.post('/create', catchErrors(leagueInfo.createLeague));

module.exports = router;