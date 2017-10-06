const express = require('express');
const userController = require('../controllers/userController');
const leagueAuth = require('../services/leagueAuthService');
const rosterController = require('../controllers/rosterController');
const { catchErrors } = require('../handlers/errorHandlers');

const router = express.Router();

router.use(userController.isLoggedIn);
router.use(catchErrors(leagueAuth.sessionLeague));
router.get('/', rosterController.userRoster);
router.use(catchErrors(rosterController.leagueRosters));
router.post('/add-player', catchErrors(rosterController.addPlayer));

module.exports = router;
