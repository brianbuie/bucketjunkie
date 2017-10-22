const express = require('express');
const auth = require('../controllers/authController');
const roster = require('../controllers/rosterController');
const { catchErrors } = require('../handlers/errorHandlers');

const router = express.Router();

router.use(auth.isLoggedIn);
router.use(catchErrors(auth.useSession));
router.post('/add-player', catchErrors(roster.addPlayer));
router.post('/remove-player', catchErrors(roster.removePlayer));
router.post('/move', catchErrors(roster.moveDraft));

module.exports = router;
