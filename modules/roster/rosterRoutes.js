const express = require('express');
const userController = require('../user/userController');
const rosterController = require('./rosterController');
const { catchErrors } = require('../error/errorHandlers');

const router = express.Router();

router.use(userController.isLoggedIn);
router.use(catchErrors(rosterController.getLeague));
router.use(catchErrors(rosterController.getRosters));
router.get('/', rosterController.displayRoster);

router.post('/add-player', catchErrors(rosterController.addPlayer));

module.exports = router;
