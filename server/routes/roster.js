const express = require('express');
const auth = require('../controllers/authController');
const roster = require('../controllers/rosterController');
const { catchErrors } = require('../handlers/errorHandlers');

const router = express.Router();

router.use(auth.isLoggedIn);
router.use(catchErrors(auth.useSession));
router.get('/', catchErrors(roster.viewRoster));
router.post('/add-player', catchErrors(roster.addPlayer));
router.post('/remove-player', catchErrors(roster.removePlayer));
router.get('/replace', catchErrors(roster.replacePlayerForm));
router.post('/replace', catchErrors(roster.replacePlayer));
router.post('/move', catchErrors(roster.moveDraft));

module.exports = router;
