const express = require('express');
const { catchErrors } = require('../handlers/errorHandlers');
const leagueController = require('../controllers/leagueController');

const router = express.Router();
router.use('/', catchErrors(leagueController.setMyLeagues));
router.get('/', catchErrors(leagueController.myLeagues));
router.use('/account', require('./account'));
router.use('/leagues', require('./leagues'));
router.use('/lg', require('./lg'));
router.use('/nba', require('./nba'));
router.use('/roster', require('./roster'));

module.exports = router;
