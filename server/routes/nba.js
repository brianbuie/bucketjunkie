const express = require('express');
const nba = require('../controllers/nbaController');
const { catchErrors } = require('../handlers/errorHandlers');

const router = express.Router();

router.get('/', catchErrors(nba.allTeams));
router.get('/team/:id', catchErrors(nba.team));
router.get('/player/:id', catchErrors(nba.player));

module.exports = router;
