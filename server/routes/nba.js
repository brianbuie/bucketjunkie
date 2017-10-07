const express = require('express');
const nbaController = require('../controllers/nbaController');
const { catchErrors } = require('../handlers/errorHandlers');

const router = express.Router();

router.get('/', catchErrors(nbaController.allTeams));
router.get('/team/:id', catchErrors(nbaController.team));
router.get('/player/:id', catchErrors(nbaController.player));

module.exports = router;
