const express = require('express');
const userController = require('../controllers/userController');
const rosterController = require('../controllers/rosterController');
const { catchErrors } = require('../handlers/errorHandlers');

const router = express.Router();

router.use(userController.isLoggedIn);
router.use(catchErrors(rosterController.getLeague));
router.use(catchErrors(rosterController.getRosters));
router.get('/', rosterController.displayRoster);

router.post('/add-player', catchErrors(rosterController.addPlayer));

module.exports = router;
