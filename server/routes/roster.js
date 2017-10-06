const express = require('express');
const userController = require('../controllers/userController');
const leagueAuth = require('../services/leagueAuthService');
const rosterController = require('../controllers/rosterController');
const { catchErrors } = require('../handlers/errorHandlers');

const router = express.Router();

router.use(userController.isLoggedIn);
router.use(catchErrors(leagueAuth.sessionLeague));
router.use(catchErrors(rosterController.setRosters));
router.post('/add-player', catchErrors(rosterController.addPlayer));

module.exports = router;
