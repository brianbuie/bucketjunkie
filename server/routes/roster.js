const express = require('express');
const userController = require('../controllers/userController');
const leagueAuth = require('../services/leagueAuthService');
const roster = require('../controllers/rosterController');
const { catchErrors } = require('../handlers/errorHandlers');

const router = express.Router();

router.use(userController.isLoggedIn);
router.use(catchErrors(leagueAuth.sessionLeague));
router.get('/', catchErrors(roster.userRoster), roster.viewRoster);
router.post('/add-player', catchErrors(roster.leagueRosters), catchErrors(roster.addPlayer));
router.post('/remove-player', catchErrors(roster.userRoster), catchErrors(roster.removePlayer));

module.exports = router;
