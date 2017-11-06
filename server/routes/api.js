const express = require('express');
const activity = require('../controllers/activityController');
const league = require('../controllers/leagueController');
const nba = require('../controllers/nbaController');
const auth = require('../controllers/authController');
const { catchErrors } = require('../handlers/errorHandlers');

const router = express.Router();

router.use(auth.isLoggedIn);
router.use(catchErrors(auth.useSession));

router.get('/activity', catchErrors(activity.get));
router.post('/activity/chat', activity.validateChat, catchErrors(activity.chat));

router.get('/league/info', league.info);
router.get('/league/leaderboard', catchErrors(league.leaderBoard));

router.get('/nba/players', catchErrors(nba.players));

module.exports = router;