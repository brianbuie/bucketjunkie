const express = require('express');
const nba = require('../controllers/nbaController');
const auth = require('../controllers/authController');
const { catchErrors } = require('../handlers/errorHandlers');

const router = express.Router();

router.use(auth.optionalSession);
router.use('/players', catchErrors(nba.players));
router.get('/player/:id', catchErrors(nba.player));

// router.get('/', catchErrors(nba.allTeams));
// router.get('/top', catchErrors(nba.topPlayers));
// router.get('/team/:id', catchErrors(nba.team));


module.exports = router;
