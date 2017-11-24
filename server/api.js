const express = require('express');
const activity = require('./controllers/activityController');
const league = require('./controllers/leagueController');
const roster = require('./controllers/rosterController');
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
router.post('/account/reset-password/:token', user.validatePasswordReset, catchErrors(user.updatePassword));

// Leagues
router.post('/leagues/create', auth.isLoggedIn, league.validateLeague, catchErrors(league.createLeague));
router.get('/leagues/mine', catchErrors(league.myLeagues));
router.get('/leagues/public', catchErrors(league.publicLeagues));

// League
router.use('/lg/:id', catchErrors(auth.useParam));
router.get('/lg/:id/join', auth.isLoggedIn, catchErrors(league.joinLeague));
router.post('/lg/:id/leave', auth.isMember, auth.notCreator, catchErrors(league.leaveLeague));
router.post('/lg/:id/edit', auth.isModerator, league.validateLeague, catchErrors(league.updateLeague));
router.post('/lg/:id/members/remove', auth.isModerator, catchErrors(league.removeMember));
router.post('/lg/:id/moderators/add', auth.isCreator, catchErrors(league.addModerator));
router.post('/lg/:id/moderators/remove', auth.isCreator, catchErrors(league.removeModerator));

// Chat
router.use('/chat', auth.isLoggedIn);
router.use('/chat', catchErrors(auth.useSession));
router.post('/chat', activity.validateChat, catchErrors(activity.chat));

// Rosters
router.post('/roster/add-player', auth.isLoggedIn, catchErrors(auth.useSession), catchErrors(roster.addPlayer));
router.post('/roster/remove-player', auth.isLoggedIn, catchErrors(auth.useSession), catchErrors(roster.removePlayer));
router.post('/roster/move', auth.isLoggedIn, catchErrors(auth.useSession), catchErrors(roster.moveDraft));

// Errors
router.use(errorHandlers.notFound);
if (process.env.NODE_ENV === 'development') router.use(errorHandlers.developmentErrors);
router.use(errorHandlers.productionErrors);


module.exports = router;