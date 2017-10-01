const express = require('express');

const router = express.Router();
const userController = require('../user/userController');
const leagueController = require('./leagueController');
const leagueAuthController = require('./leagueAuthController');
const { catchErrors } = require('../error/errorHandlers');

router.get('/public', catchErrors(leagueController.publicLeagues));
router.param('id', catchErrors(leagueAuthController.setLeague));
router.param('id', leagueAuthController.setPermissions);
router.get('/:id', catchErrors(leagueController.leagueOverview));

router.use(userController.isLoggedIn);
router.get('/', catchErrors(leagueController.myLeagues));
router.get('/create', leagueController.createLeagueForm);
router.post('/create', catchErrors(leagueController.createLeague));
router.get('/:id/join', catchErrors(leagueAuthController.joinLeague));

router.use(leagueAuthController.isMember);
router.get('/:id/leave', leagueAuthController.confirmLeaveLeague);
router.post('/:id/leave', catchErrors(leagueAuthController.leaveLeague));

router.use(leagueAuthController.isModerator);
router.get('/:id/edit', leagueController.editLeagueForm);
router.post('/:id/edit', catchErrors(leagueController.updateLeague));
router.post('/:id/members/remove', catchErrors(leagueAuthController.removeMember));

router.use(leagueAuthController.isCreator);
router.post('/:id/moderators/add', catchErrors(leagueAuthController.addModerator));
router.post('/:id/moderators/remove', catchErrors(leagueAuthController.removeModerator));

module.exports = router;
