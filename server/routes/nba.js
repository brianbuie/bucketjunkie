const express = require('express');
const nba = require('../controllers/nbaController');
const auth = require('../controllers/authController');
const { catchErrors } = require('../handlers/errorHandlers');

const router = express.Router();

router.use(auth.isLoggedIn)
router.use(catchErrors(auth.useSession));
router.use('/players', catchErrors(nba.players));
// router.get('/player/:id', catchErrors(nba.player));
// router.get('/', catchErrors(nba.allTeams));


module.exports = router;
