const express = require('express');

const router = express.Router();
const nbaController = require('./nbaController');
const { catchErrors } = require('../error/errorHandlers');

router.get('/', nbaController.allTeams);
router.get('/team/:id', nbaController.team);
router.get('/player/:id', nbaController.player);

module.exports = router;
