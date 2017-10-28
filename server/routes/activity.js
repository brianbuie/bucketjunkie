const express = require('express');
const activity = require('../controllers/activityController');
const auth = require('../controllers/authController');
// const league = require('../controllers/leagueController');
const { catchErrors } = require('../handlers/errorHandlers');

const router = express.Router();

router.use(auth.isLoggedIn);
router.use(catchErrors(auth.useSession));
router.get('/', catchErrors(activity.get));
router.post('/chat', activity.validateChat, catchErrors(activity.chat));

module.exports = router;