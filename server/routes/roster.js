const express = require('express');
const auth = require('../controllers/authController');
const roster = require('../controllers/rosterController');
const { catchErrors } = require('../handlers/errorHandlers');

const router = express.Router();

router.use(auth.isLoggedIn);
router.use(catchErrors(auth.useSession));
router.get('/', catchErrors(roster.userRoster), roster.viewRoster);
router.post('/add-player', catchErrors(roster.leagueRosters), catchErrors(roster.addPlayer));
router.post('/remove-player', catchErrors(roster.userRoster), catchErrors(roster.removePlayer));

module.exports = router;
