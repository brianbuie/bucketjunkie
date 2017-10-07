const express = require('express');
const auth = require('../controllers/authController');
const leagueInfo = require('../controllers/leagueInfoCtrl');
const { catchErrors } = require('../handlers/errorHandlers');

const router = express.Router();

router.get('/public', catchErrors(leagueInfo.publicLeagues));

router.use(auth.isLoggedIn);
router.get('/', catchErrors(leagueInfo.myLeagues));
router.get('/create', leagueInfo.createLeagueForm);
router.post('/create', leagueInfo.validateLeague, catchErrors(leagueInfo.createLeague));

module.exports = router;