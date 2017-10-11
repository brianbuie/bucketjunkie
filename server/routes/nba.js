const express = require('express');
const nba = require('../controllers/nbaController');
const auth = require('../controllers/authController');
const { catchErrors } = require('../handlers/errorHandlers');

const router = express.Router();

router.use(auth.optionalSession);
router.get('/', catchErrors(nba.allTeams));
router.get('/top', catchErrors(nba.topPlayers));
router.get('/team/:id', catchErrors(nba.team));
router.get('/player/:id', catchErrors(nba.player));

module.exports = router;
