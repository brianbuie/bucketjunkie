const express = require('express');
const auth = require('../controllers/authController');
const league = require('../controllers/leagueController');
const { catchErrors } = require('../handlers/errorHandlers');

const router = express.Router();

router.get('/public', catchErrors(league.publicLeagues));

router.use(auth.isLoggedIn);
router.get('/', catchErrors(league.myLeagues));
router.get('/create', league.createLeagueForm);
router.post('/create', league.validateLeague, catchErrors(league.createLeague));

module.exports = router;