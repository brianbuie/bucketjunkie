const express = require('express');

const router = express.Router();
const nbaController = require('./nbaController');
const { catchErrors } = require('../error/errorHandlers');

router.get('/', catchErrors(nbaController.allTeams));
router.get('/team/:id', catchErrors(nbaController.team));
router.get('/player/:id', catchErrors(nbaController.player));

module.exports = router;
