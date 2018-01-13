const express = require('express');
const activity = require('./controllers/activityController');
const league = require('./controllers/leagueController');
const roster = require('./controllers/rosterController');
const render = require('./controllers/renderController');
const nba = require('./controllers/nbaController');
const auth = require('./controllers/authController');
const user = require('./controllers/userController');
const { catchErrors } = require('./handlers/errorHandlers');
const errorHandlers = require('./handlers/errorHandlers');

const router = express.Router();

// Account
router.post('/account', auth.isLoggedIn, user.uploadPhoto, catchErrors(user.resizePhoto), catchErrors(user.updateAccount));
router.post('/account/login', user.login);
router.get('/account/logout', user.logout);
router.post('/account/register', catchErrors(user.validateRegister), catchErrors(user.register), user.login);
router.post('/account/forgot-password', catchErrors(user.createResetToken));
router.post('/account/validate-token', catchErrors(user.validatePasswordToken));
router.post('/account/reset-password', user.validatePasswordReset, catchErrors(user.updatePassword));

router.post('/session/initial-state', render.updateSessionInitialState);

// Leagues
router.post('/leagues/create', auth.isLoggedIn, league.stripFields, league.validateLeague, catchErrors(league.createLeague));
router.get('/leagues/mine', catchErrors(league.myLeagues));
router.get('/leagues/public', catchErrors(league.publicLeagues));
router.get('/leagues/public/:id', catchErrors(league.getLeague));

// League
router.use('/lg/:id', catchErrors(auth.useParam));
router.get('/lg/:id', league.verifyLeague);
router.get('/lg/:id/join', auth.isLoggedIn, catchErrors(league.joinLeague));
router.post('/lg/:id/leave', auth.isMember, auth.notCreator, catchErrors(league.leaveLeague));
router.post('/lg/:id/edit', auth.isModerator, league.stripFields, league.validateLeague, catchErrors(league.updateLeague));
router.post('/lg/:id/members/remove', auth.isModerator, catchErrors(league.removeMember));
router.post('/lg/:id/moderators/add', auth.isCreator, catchErrors(league.addModerator));
router.post('/lg/:id/moderators/remove', auth.isCreator, catchErrors(league.removeModerator));

// Activity
router.use('/activity', auth.isLoggedIn);
router.use('/activity', catchErrors(auth.useSession));
router.get('/activity', activity.get);
router.post('/activity/chat', activity.validateChat, catchErrors(activity.chat));

// Rosters
router.use('/rosters', auth.isLoggedIn);
router.use('/rosters', catchErrors(auth.useSession));
router.get('/rosters', catchErrors(roster.leagueRosters));
router.post('/rosters/add-player', catchErrors(roster.addPlayer));
router.post('/rosters/remove-player', catchErrors(roster.removePlayer));
router.post('/rosters/move', catchErrors(roster.moveDraft));

// Scores
router.use('/scores', auth.isLoggedIn);
router.use('/scores', catchErrors(auth.useSession));
router.get('/scores/league', catchErrors(activity.leagueTotalScores));

// Players
router.get('/nba/boxscores/player/:id', catchErrors(nba.playerBoxscores));

// Errors
router.use(errorHandlers.notFound);
if (process.env.NODE_ENV === 'development') router.use(errorHandlers.developmentErrors);
router.use(errorHandlers.productionErrors);


module.exports = router;